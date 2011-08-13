#include "curl.h"

void NodeCurl::Init (Handle<Object> target) {
    NODE_SET_METHOD (target , "request" , request ) ;
    NODE_SET_METHOD (target , "get"     , get     ) ;
    NODE_SET_METHOD (target , "post"    , post    ) ;
}

// curl.request (options);
Handle<Value> NodeCurl::request (const Arguments& args) {
    HandleScope scope;

    if (args.Length () != 1 && !args[0]->IsObject ())
        return THROW_BAD_ARGS;

    Handle<Object> options = Handle<Object>::Cast (args[0]);

    return Request::New (scope.Close (options), true);
}

// curl.get (options[, data]);
Handle<Value> NodeCurl::get (const Arguments&) {

    return Undefined ();
}

// curl.post (options[, data]);
Handle<Value> NodeCurl::post (const Arguments&) {

    return Undefined ();
}

