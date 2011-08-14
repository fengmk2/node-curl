#include "curl.h"
#include <iostream>
#include <utility>
#include <string.h>
#include <unistd.h>

#define THROW_REQUEST_ALREADY_SEND \
    ThrowException(Exception::Error(String::New("Request is already sent")))

Request::Request ()
    : curl_ (curl_easy_init ()),
      is_post_ (false),
      read_pos_ (0)
{
    curl_easy_setopt (curl_, CURLOPT_READFUNCTION, read_data);
    curl_easy_setopt (curl_, CURLOPT_READDATA, this);
    curl_easy_setopt (curl_, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt (curl_, CURLOPT_WRITEDATA, this);
}

Request::~Request () {
    if (curl_) curl_easy_cleanup (curl_);
}

Handle<Value> Request::New (Handle<Object> options) {
    HandleScope scope;

    Handle<Object> handle (NewTemplate ()->NewInstance ());
    Request *request = new Request ();
    request->Wrap (handle);

    // Set options
    Handle<Value> url    = options->Get (String::New ("url"));
    Handle<Value> method = options->Get (String::New ("method"));
    // options.url
    curl_easy_setopt (request->curl_, CURLOPT_URL, *String::Utf8Value (url));
    // options.method
    if (!strcasecmp ("POST", *String::AsciiValue (method))) {
        request->is_post_ = true;
        curl_easy_setopt (request->curl_, CURLOPT_POST, 1);
    }
    // options.useragent
    if (options->Has (String::New ("useragent"))) {
        curl_easy_setopt (request->curl_, CURLOPT_USERAGENT,
              *String::AsciiValue (options->Get (String::New ("useragent"))));
    } else {
        curl_easy_setopt (request->curl_, CURLOPT_USERAGENT, "zcbenz/node-curl");
    }

    return handle;
}

// request.write(chunk)
Handle<Value> Request::write (const Arguments& args) {
    HandleScope scope;

    if (args.Length () != 1 && !args[0]->IsString ())
        return THROW_BAD_ARGS;

    Request *request = Unwrap (args.Holder ());
    if (!request)
        return THROW_REQUEST_ALREADY_SEND;

    String::Utf8Value chunk (Handle<String>::Cast (args[0]));
    request->read_buffer_.insert (request->read_buffer_.end (),
                                  *chunk,
                                  *chunk + chunk.length ());

    return Undefined ();
}

// request.end([chunk])
Handle<Value> Request::end (const Arguments& args) {
    HandleScope scope;

    if (args.Length () > 1)
        return THROW_BAD_ARGS;

    // Have chunk
    if (args.Length () == 1) {
        if (!args[0]->IsString ())
            return THROW_BAD_ARGS;

        Request::write (args);
    }

    Request *request = Unwrap (args.Holder ());
    if (!request)
        return THROW_REQUEST_ALREADY_SEND;

    // Must set file size
    if (request->is_post_)
        curl_easy_setopt (request->curl_, CURLOPT_POSTFIELDSIZE, request->read_buffer_.size ());

    // Send them all!
    CURLcode res = curl_easy_perform (request->curl_);
    if (CURLE_OK != res) {
        return ThrowException (Exception::Error (
                    String::New (curl_easy_strerror (res))));
    }

    Handle<Object> result = request->GetResult ();

    // Request object is done now;
    delete request;
    args.Holder()->SetPointerInInternalField (0, NULL);

    return scope.Close (result);
}

// request.endFile(filename)
Handle<Value> Request::endFile (const Arguments& args) {

    return Undefined ();
}

Handle<ObjectTemplate> Request::NewTemplate () {
    HandleScope scope;

    Handle<ObjectTemplate> tpl = ObjectTemplate::New ();
    tpl->SetInternalFieldCount (1);
    NODE_SET_METHOD (tpl , "write" , Request::write);
    NODE_SET_METHOD (tpl , "end"   , Request::end);

    return scope.Close (tpl);
}

Handle<Object> Request::GetResult () const {
    HandleScope scope;

    long statusCode;
    curl_easy_getinfo (curl_, CURLINFO_RESPONSE_CODE, &statusCode);
    const char *content_type;
    curl_easy_getinfo (curl_, CURLINFO_CONTENT_TYPE, &content_type);
    double content_length;
    curl_easy_getinfo (curl_, CURLINFO_CONTENT_LENGTH_DOWNLOAD, &content_length);
    const char *ip;
    curl_easy_getinfo (curl_, CURLINFO_PRIMARY_IP, &ip);

    Handle<Object> result = Object::New ();
    result->Set (String::NewSymbol ("statusCode"), Integer::New (statusCode));
    result->Set (String::NewSymbol ("ip"), String::New (ip));
    result->Set (String::NewSymbol ("data"), 
            String::New (&write_buffer_[0], write_buffer_.size ()));
    Handle<Object> headers = Object::New ();
    result->Set (String::NewSymbol ("headers"), headers);
    if (content_type) {
        headers->Set (String::NewSymbol ("content-type"),
                      String::New (content_type));
    }
    if (content_length > -1) {
        headers->Set (String::NewSymbol ("content-length"),
                      Integer::New ((long) content_length));
    }

    return scope.Close (result);
}

size_t Request::read_data (void *ptr, size_t size, size_t nmemb, void *userdata) {
    Request *request = static_cast<Request*> (userdata);

    // How many data to write
    size_t need = size * nmemb;
    size_t leaved = request->read_buffer_.size () - request->read_pos_;
    size_t to_write = std::min (need, leaved);

    if (to_write == 0) {
        return 0;
    }

    // Copy data
    memcpy(ptr, &(request->read_buffer_[request->read_pos_]), to_write);
    request->read_pos_ += to_write;

    return to_write;
}

size_t Request::write_data (void *ptr, size_t size, size_t nmemb, void *userdata) {
    Request *request = static_cast<Request*> (userdata);

    // Copy data to buffer
    char *comein = static_cast<char*> (ptr);
    request->write_buffer_.insert (request->write_buffer_.end (),
                                   comein, 
                                   comein + size * nmemb);

    return size * nmemb;
}

Request* Request::Unwrap (v8::Handle<v8::Object> handle) {
    return static_cast<Request*>(handle->GetPointerFromInternalField(0));
}

void Request::Wrap (v8::Handle<v8::Object> handle) {
    handle->SetPointerInInternalField(0, this);
}
