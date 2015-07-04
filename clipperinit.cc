#include <node.h>
#include <v8.h>
#include <vector>
#include "lib/ClipperWrap.hpp"

using namespace std;
using namespace v8;
using namespace ClipperLib;

Handle<Value> Begin(const Arguments& args) {
    HandleScope scope;
    return scope.Close(ClipperWrap::NewInstance(args));
}

Handle<Value> Area(const Arguments& args) {
    HandleScope scope;
    return scope.Close(compute_area(args));
}

Handle<Value> Clean(const Arguments& args) {
    HandleScope scope;
    return scope.Close(clean(args));
}

Handle<Value> Orientation(const Arguments& args) {
    HandleScope scope;
    return scope.Close(orientation(args));
}

Handle<Value> Simplify(const Arguments& args) {
    HandleScope scope;
    return scope.Close(simplify(args));
}

extern "C" {
    static void init(Handle<Object> exports) {
        ClipperWrap::Init();

        exports->Set(String::NewSymbol("begin"),
            FunctionTemplate::New(Begin)->GetFunction());
        exports->Set(String::NewSymbol("area"),
            FunctionTemplate::New(Area)->GetFunction());
        exports->Set(String::NewSymbol("clean"),
            FunctionTemplate::New(Clean)->GetFunction());
        exports->Set(String::NewSymbol("orientation"),
            FunctionTemplate::New(Orientation)->GetFunction());
        exports->Set(String::NewSymbol("simplify"),
            FunctionTemplate::New(Simplify)->GetFunction());
    }
    NODE_MODULE(clipper, init)
}