#include <node.h>
#include "ClipperWrap.hpp"

using namespace std;
using namespace v8;
using namespace ClipperLib;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Clipper Wrap

Persistent<Function> ClipperWrap::constructor;

ClipperWrap::ClipperWrap(PolyFillType s_fill, PolyFillType c_fill) {
    subj_fill_ = s_fill;
    clip_fill_ = c_fill;
}

ClipperWrap::~ClipperWrap() {}

void ClipperWrap::Init() {
    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
    tpl->SetClassName(String::NewSymbol("ClipperWrap"));
    tpl->InstanceTemplate()->SetInternalFieldCount(2);

    // Prototypes
    tpl->PrototypeTemplate()->Set(String::NewSymbol("addSubjectPath"),
        FunctionTemplate::New(AddSubjectPath)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("addClipPath"),
        FunctionTemplate::New(AddClipPath)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("union"),
        FunctionTemplate::New(Union)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("intersection"),
        FunctionTemplate::New(Intersection)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("difference"),
        FunctionTemplate::New(Difference)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("xor"),
        FunctionTemplate::New(Xor)->GetFunction());

    constructor = Persistent<Function>::New(tpl->GetFunction());
}

Handle<Value> ClipperWrap::New(const Arguments& args) {
    HandleScope scope;

    if (args.IsConstructCall()) {
        // Invoked as constructor: `new ClipperWrap(...)`
        PolyFillType s_fill = args[0]->IsUndefined() ? pftEvenOdd : get_polyfilltype(args[0]->NumberValue());
        PolyFillType c_fill = args[1]->IsUndefined() ? pftEvenOdd : get_polyfilltype(args[1]->NumberValue());
        ClipperWrap* obj = new ClipperWrap(s_fill, c_fill);
        obj->Wrap(args.This());
        return args.This();
    } else {
        // Invoked as plain function `ClipperWrap(...)`, turn into construct call.
        const int argc = 2;
        Local<Value> argv[argc] = { args[0], args[1] };
        return scope.Close(constructor->NewInstance(argc, argv));
    }
}

Handle<Value> ClipperWrap::NewInstance(const Arguments& args) {
    HandleScope scope;

    const unsigned argc = 2;
    Handle<Value> argv[argc] = { args[0], args[1] };
    Local<Object> instance = constructor->NewInstance(argc, argv);

    return scope.Close(instance);
}

Handle<Value> ClipperWrap::AddSubjectPath(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());
    
    // First argument is the paths - array
    if (!args[0]->IsArray()) {
        ThrowException(Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    // Second argument is the closed flag - boolean
    if (!args[1]->IsBoolean()) {
        ThrowException(Exception::TypeError(String::New("Wrong type for argument 2: expected boolean")));
        return scope.Close(Undefined());
    }

    Local<Array> path = Array::Cast(*args[0]);
    // Check the length of the path - must be even
    if (path->Length() % 2 != 0) {
        ThrowException(Exception::Error(String::New("Wrong number of vertex coordinates in list")));
        return scope.Close(Undefined());
    }

    if (!add_path(obj->clipper_, path, ptSubject, args[1]->ToBoolean()->Value())) {
        return scope.Close(Undefined());
    }

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::AddClipPath(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());
    
    // First argument is the paths - array
    if (!args[0]->IsArray()) {
        ThrowException(Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    Local<Array> path = Array::Cast(*args[0]);
    // Check the length of the path - must be even
    if (path->Length() % 2 != 0) {
        ThrowException(Exception::Error(String::New("Wrong number of vertex coordinates in list")));
        return scope.Close(Undefined());
    }

    if (!add_path(obj->clipper_, path, ptClip, true)) {
        return scope.Close(Undefined());
    }

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::Union(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(*obj, final, ctUnion)) {
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Intersection(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(*obj, final, ctIntersection)) {
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Difference(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(*obj, final, ctDifference)) {
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Xor(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(*obj, final, ctXor)) {
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

bool ClipperWrap::do_clipping_operation(ClipperWrap &obj, Handle<Array> &final, ClipType type) {
    PolyTree solution;

    // Execute the union operation
    if (!obj.clipper_.Execute(type, solution, obj.subj_fill_, obj.clip_fill_)) {
        ThrowException(Exception::Error(String::New("An error occurred when attempting to perform the union operation")));
        return false;
    }

    Handle<Array> polygons = Array::New();
    Handle<Array> polylines = Array::New();

    get_clip_solution(solution, polygons, polylines);

    // Set the final array as a 2-element array containing the list of polygons and the list of polylines
    final->Set(final->Length(), polygons);
    final->Set(final->Length(), polylines);

    return true;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utilities

PolyFillType get_polyfilltype (double value) {
    switch((int) value) {
        case 0: return pftEvenOdd;
        case 1: return pftNonZero;
        case 2: return pftPositive;
        case 3: return pftNegative;
        default: return pftEvenOdd;
    }
}

void get_vertices_from_path(Path &path, Handle<Array> &array) {
    for (vector<IntPoint>::iterator point_iter = path.begin(); point_iter != path.end(); ++point_iter) {
        // Retrieve the points from the path as doubles
        Handle<Number> x = Number::New((double)point_iter->X);
        Handle<Number> y = Number::New((double)point_iter->Y);
        array->Set(array->Length(), x);
        array->Set(array->Length(), y);
    }
}

void get_clip_solution(PolyTree &solution, Handle<Array> &polygons, Handle<Array> &polylines) {
    Paths open, closed;

    OpenPathsFromPolyTree(solution, open);
    ClosedPathsFromPolyTree(solution, closed);

    // Use handles to collect polygon vertices into array for polygons
    for (vector<Path>::iterator path_it = closed.begin(); path_it != closed.end(); ++path_it) {
        Handle<Array> vertices = Array::New();
        get_vertices_from_path(*path_it, vertices);
        polygons->Set(polygons->Length(), vertices);
    }
    // Use handles to collect polyline vertices into array for polylines
    for (vector<Path>::iterator path_it = open.begin(); path_it != open.end(); ++path_it) {
        Handle<Array> vertices = Array::New();
        get_vertices_from_path(*path_it, vertices);
        polylines->Set(polylines->Length(), vertices);
    }

}

bool add_path(Clipper &clipper, Local<Array> &vertices, PolyType type, bool closed) {
    int i;
    const int len = vertices->Length();
    Path path;
    for (i = 0; i < len; i+=2) {
        double a = vertices->Get(i)->NumberValue(),
               b = vertices->Get(i+1)->NumberValue();
        path << IntPoint(a, b);
    }

    if (!clipper.AddPath(path, type, closed)) {
        ThrowException(Exception::Error(String::New("An error occurred when attempting to add a path")));
        return false;
    }

    return true;
}