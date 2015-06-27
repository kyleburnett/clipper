#include <node.h>
#include "ClipperWrap.hpp"

using namespace std;
using namespace v8;
using namespace ClipperLib;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Clipper Wrap

Persistent<Function> ClipperWrap::constructor;

ClipperWrap::ClipperWrap() {
    subj_fill_ = pftEvenOdd;
    clip_fill_ = pftEvenOdd;
    factor_ = 1.0;
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
    tpl->PrototypeTemplate()->Set(String::NewSymbol("setFillTypes"),
        FunctionTemplate::New(SetFillTypes)->GetFunction());
    tpl->PrototypeTemplate()->Set(String::NewSymbol("setFactor"),
        FunctionTemplate::New(SetFactor)->GetFunction());
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
        ClipperWrap* obj;
        Local<Function> cb;
        if (args[0]->IsFunction()) {
            cb = Local<Function>::Cast(args[0]);
            obj = new ClipperWrap();
            const unsigned argc = 2;
            obj->Wrap(args.This());
            Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), args.This() };
            cb->Call(Context::GetCurrent()->Global(), argc, argv);
            return scope.Close(Undefined());
        } else {
            obj = new ClipperWrap();
            obj->Wrap(args.This());
            return args.This();
        }
    } else {
        // Invoked as plain function `ClipperWrap(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        return scope.Close(constructor->NewInstance(argc, argv));
    }
}

Handle<Value> ClipperWrap::NewInstance(const Arguments& args) {
    HandleScope scope;

    const unsigned argc = 1;
    Handle<Value> argv[argc] = { args[0] };
    Local<Object> instance = constructor->NewInstance(argc, argv);

    return scope.Close(instance);
}

Handle<Value> ClipperWrap::AddSubjectPath(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());
    
    // First argument is the paths - array
    if (!args[0]->IsArray()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    // Second argument is the closed flag - boolean
    if (!args[1]->IsBoolean()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 2: expected boolean")));
        return scope.Close(Undefined());
    }

    Local<Array> path = Array::Cast(*args[0]);
    // Check the length of the path - must be even
    if (path->Length() % 2 != 0) {
        handle_exception(args, Exception::TypeError(String::New("Wrong number of vertex coordinates in list")));
        return scope.Close(Undefined());
    }

    if (!add_path(args, obj->clipper_, path, ptSubject, args[1]->ToBoolean()->Value(), obj->factor_)) {
        return scope.Close(Undefined());
    }

    if (args.Length() == 3 && args[2]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[2]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(Undefined()) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
    }

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::AddClipPath(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());
    
    // First argument is the paths - array
    if (!args[0]->IsArray()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    Local<Array> path = Array::Cast(*args[0]);
    // Check the length of the path - must be even
    if (path->Length() % 2 != 0) {
        handle_exception(args, Exception::Error(String::New("Wrong number of vertex coordinates in list")));
        return scope.Close(Undefined());
    }

    if (!add_path(args, obj->clipper_, path, ptClip, true, obj->factor_)) {
        return scope.Close(Undefined());
    }

    if (args.Length() == 2 && args[1]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[1]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(Undefined()) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
    }

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::SetFillTypes(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    PolyFillType subj_temp, clip_temp;

    // First argument
    if (args[0]->IsUndefined()) {
        handle_exception(args, Exception::Error(String::New("Requires 1 to 3 arguments")));
        return scope.Close(Undefined());
    } else {
        if (!args[0]->IsNumber()) {
            handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected number")));
            return scope.Close(Undefined());
        } else {
            subj_temp = get_polyfilltype(args[0]->NumberValue());
        }
    }

    // Second argument (optional)
    if (!args[1]->IsUndefined()) {
        if (args[1]->IsNumber()) {
            clip_temp = get_polyfilltype(args[1]->NumberValue());
        } else if (args[1]->IsFunction()) {
            obj->subj_fill_ = subj_temp;
            Local<Function> cb = Local<Function>::Cast(args[1]);
            const unsigned argc = 2;
            Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(Undefined()) };
            cb->Call(Context::GetCurrent()->Global(), argc, argv);
            return scope.Close(Undefined());
        } else {
            handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 2: expected number or function")));
            return scope.Close(Undefined());
        }
    }

    // Third argument (optional)
    if (!args[2]->IsUndefined()) {
        if (args[2]->IsFunction()) {
            obj->subj_fill_ = subj_temp;
            obj->clip_fill_ = clip_temp;
            Local<Function> cb = Local<Function>::Cast(args[2]);
            const unsigned argc = 2;
            Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(Undefined()) };
            cb->Call(Context::GetCurrent()->Global(), argc, argv);
            return scope.Close(Undefined());
        } else {
            handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 3: expected function")));
            return scope.Close(Undefined());
        }
    }

    // Commit changes
    obj->subj_fill_ = subj_temp;
    obj->clip_fill_ = clip_temp;

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::SetFactor(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    if (args.Length() < 1 || args.Length() > 2) {
        handle_exception(args, Exception::Error(String::New("Requires 1 or 2 arguments")));
        return scope.Close(Undefined());
    }

    // First argument
    if (!args[0]->IsNumber()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected number")));
        return scope.Close(Undefined());
    }

    // Second argument (optional)
    if (args.Length() == 2 && args[1]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[1]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(Undefined()) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
    }

    obj->factor_ = args[0]->NumberValue();

    return scope.Close(Undefined());
}

Handle<Value> ClipperWrap::Union(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(args, *obj, final, ctUnion)) {
        return scope.Close(Undefined());
    }

    if (args[0]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[0]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(final) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Intersection(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(args, *obj, final, ctIntersection)) {
        return scope.Close(Undefined());
    }

    if (args[0]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[0]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(final) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Difference(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(args, *obj, final, ctDifference)) {
        return scope.Close(Undefined());
    }

    if (args[0]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[0]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(final) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

Handle<Value> ClipperWrap::Xor(const Arguments& args) {
    HandleScope scope;

    ClipperWrap* obj = ObjectWrap::Unwrap<ClipperWrap>(args.This());

    Handle<Array> final = Array::New();

    if (!do_clipping_operation(args, *obj, final, ctXor)) {
        return scope.Close(Undefined());
    }

    if (args[0]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[0]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(final) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(final);
}

bool ClipperWrap::do_clipping_operation(const Arguments& args, ClipperWrap &obj, Handle<Array> &final, ClipType type) {
    PolyTree solution;

    // Execute the union operation
    if (!obj.clipper_.Execute(type, solution, obj.subj_fill_, obj.clip_fill_)) {
        handle_exception(args, Exception::Error(String::New("An error occurred when attempting to perform the union operation")));
        return false;
    }

    Handle<Array> polygons = Array::New();
    Handle<Array> polylines = Array::New();

    get_clip_solution(solution, polygons, polylines, obj.factor_);

    // Set the final array as a 2-element array containing the list of polygons and the list of polylines
    final->Set(final->Length(), polygons);
    final->Set(final->Length(), polylines);

    return true;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utilities

PolyFillType get_polyfilltype(double value) {
    switch((int) value) {
        case 0: return pftEvenOdd;
        case 1: return pftNonZero;
        case 2: return pftPositive;
        case 3: return pftNegative;
        default: return pftEvenOdd;
    }
}

void get_vertices_from_path(Path &path, Handle<Array> &array, double factor) {
    for (vector<IntPoint>::iterator point_iter = path.begin(); point_iter != path.end(); ++point_iter) {
        // Retrieve the points from the path as doubles
        Handle<Number> x = Number::New(((double)point_iter->X) / factor);
        Handle<Number> y = Number::New(((double)point_iter->Y) / factor);
        array->Set(array->Length(), x);
        array->Set(array->Length(), y);
    }
}

void get_clip_solution(PolyTree &solution, Handle<Array> &polygons, Handle<Array> &polylines, double factor) {
    Paths open, closed;

    OpenPathsFromPolyTree(solution, open);
    ClosedPathsFromPolyTree(solution, closed);

    // Use handles to collect polygon vertices into array for polygons
    for (vector<Path>::iterator path_it = closed.begin(); path_it != closed.end(); ++path_it) {
        Handle<Array> vertices = Array::New();
        get_vertices_from_path(*path_it, vertices, factor);
        polygons->Set(polygons->Length(), vertices);
    }
    // Use handles to collect polyline vertices into array for polylines
    for (vector<Path>::iterator path_it = open.begin(); path_it != open.end(); ++path_it) {
        Handle<Array> vertices = Array::New();
        get_vertices_from_path(*path_it, vertices, factor);
        polylines->Set(polylines->Length(), vertices);
    }

}

bool add_path(const Arguments& args, Clipper &clipper, Local<Array> &vertices, PolyType type, bool closed, double factor) {
    int i;
    const int len = vertices->Length();
    Path path;
    for (i = 0; i < len; i+=2) {
        double a = vertices->Get(i)->NumberValue() * factor,
               b = vertices->Get(i+1)->NumberValue() * factor;
        path << IntPoint(a, b);
    }

    if (!clipper.AddPath(path, type, closed)) {
        handle_exception(args, Exception::Error(String::New("An error occurred when attempting to add a path")));
        return false;
    }

    return true;
}

void handle_exception(const Arguments& args, Local<Value> e) {
    int last = (int)(args.Length() - 1);
    if (args[last]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[last]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(e), Local<Value>::New(Undefined()) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
    } else {
        ThrowException(e);
    }
}

Handle<Value> compute_area(const Arguments& args) {
    HandleScope scope;
    double factor = 1.0;

    if (!args[0]->IsArray()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    if (args[1]->IsNumber()) {
        factor = args[1]->NumberValue();
    }

    int i;
    Local<Array> vertices = Array::Cast(*args[0]);
    const int len = vertices->Length();
    Path path;
    for (i = 0; i < len; i+=2) {
        double a = vertices->Get(i)->NumberValue() * factor,
               b = vertices->Get(i+1)->NumberValue() * factor;
        path << IntPoint(a, b);
    }

    double area = Area(path) / (factor * factor);
    Local<Value> result = Number::New(area);

    int arg_len = args.Length();
    if (args[arg_len-1]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[arg_len-1]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(result) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(result);
}

Handle<Value> clean(const Arguments& args) {
    HandleScope scope;
    double factor = 1.0, distance = 1.415;

    if (!args[0]->IsArray()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    if (args[1]->IsNumber()) {
        factor = args[1]->NumberValue();
        if (args[2]->IsNumber()) {
            distance = args[2]->NumberValue();
        }
    }

    int i;
    Local<Array> vertices = Array::Cast(*args[0]);
    const int len = vertices->Length();
    Path path;
    for (i = 0; i < len; i+=2) {
        double a = vertices->Get(i)->NumberValue() * factor,
               b = vertices->Get(i+1)->NumberValue() * factor;
        path << IntPoint(a, b);
    }

    Path out;
    CleanPolygon(path, out, distance);

    Handle<Array> result = Array::New();
    get_vertices_from_path(out, result, factor);

    int arg_len = args.Length();
    if (args[arg_len-1]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[arg_len-1]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(result) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(result);
}

Handle<Value> simplify(const Arguments& args) {
    HandleScope scope;
    double factor = 1.0;
    PolyFillType polyfill = pftEvenOdd;

    if (!args[0]->IsArray()) {
        handle_exception(args, Exception::TypeError(String::New("Wrong type for argument 1: expected array")));
        return scope.Close(Undefined());
    }

    if (args[1]->IsNumber()) {
        factor = args[1]->NumberValue();
        if (args[2]->IsNumber()) {
            polyfill = get_polyfilltype(args[2]->NumberValue());
        }
    }

    int i;
    Local<Array> vertices = Array::Cast(*args[0]);
    const int len = vertices->Length();
    Path path;
    for (i = 0; i < len; i+=2) {
        double a = vertices->Get(i)->NumberValue() * factor,
               b = vertices->Get(i+1)->NumberValue() * factor;
        path << IntPoint(a, b);
    }

    Paths out;
    SimplifyPolygon(path, out, polyfill);

    Handle<Array> result = Array::New();
    Handle<Array> result_out = Array::New();
    Handle<Array> result_hole = Array::New();
    for (vector<Path>::iterator path_it = out.begin(); path_it != out.end(); ++path_it) {
        Handle<Array> path_result = Array::New();
        get_vertices_from_path(*path_it, path_result, factor);
        if (Orientation(*path_it)) {
            result_out->Set(result_out->Length(), path_result);
        } else {
            result_hole->Set(result_hole->Length(), path_result);
        }
    }
    result->Set(0, result_out);
    result->Set(1, result_hole);

    int arg_len = args.Length();
    if (args[arg_len-1]->IsFunction()) {
        Local<Function> cb = Local<Function>::Cast(args[arg_len-1]);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { Local<Value>::New(Boolean::New(false)), Local<Value>::New(result) };
        cb->Call(Context::GetCurrent()->Global(), argc, argv);
        return scope.Close(Undefined());
    }

    return scope.Close(result);
}