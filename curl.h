#ifndef CURL_H
#define CURL_H

#include <v8.h>
#include <node.h>
#include <curl/curl.h>
#include <vector>
using namespace v8;

// Global object exposed to the world
class NodeCurl : public node::ObjectWrap {
    public:
        static void Init (Handle<Object> target);

        // Public APIs
        static Handle<Value> request (const Arguments&);
        static Handle<Value> get (const Arguments&);
        static Handle<Value> post (const Arguments&);
};

// Request Object
class Request : public node::ObjectWrap {
    public:
        Request ();
        ~Request ();

        static Handle<Value> New (Handle<Object> options, bool raw = false);

        // Public APIs
        // request.write(chunk)
        static Handle<Value> write (const Arguments&);
        // request.end([chunk])
        static Handle<Value> end (const Arguments&);
        // request.endFile(filename)
        static Handle<Value> endFile (const Arguments&);

    private:
        static Handle<ObjectTemplate> NewTemplate ();

        static size_t read_data (void *ptr, size_t size, size_t nmemb, void *userdata);
        static size_t write_data (void *ptr, size_t size, size_t nmemb, void *userdata);

        CURL *curl_;
        typedef std::vector<char> buffer_t;
        buffer_t read_buffer_, write_buffer_;
        size_t read_pos_;
};

#define THROW_BAD_ARGS \
    ThrowException(Exception::TypeError(String::New("Bad argument")))

#endif /* end of CURL_H */
