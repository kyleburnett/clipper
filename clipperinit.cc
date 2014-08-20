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

extern "C" {
    static void init(Handle<Object> exports) {
        ClipperWrap::Init();

        exports->Set(String::NewSymbol("begin"),
            FunctionTemplate::New(Begin)->GetFunction());
        exports->Set(String::NewSymbol("area"),
        	FunctionTemplate::New(Area)->GetFunction());
    }
    NODE_MODULE(clipper, init)
}