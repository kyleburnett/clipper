#ifndef CLIPPERWRAP_H
#define CLIPPERWRAP_H

#include <node.h>
#include "../src/clipper.hpp"

class ClipperWrap : public node::ObjectWrap {
    public:
        static void Init();
        static v8::Handle<v8::Value> NewInstance(const v8::Arguments& args);

    private:
        explicit ClipperWrap();
        ~ClipperWrap();

        static v8::Handle<v8::Value> New(const v8::Arguments& args);
        static v8::Handle<v8::Value> AddSubjectPath(const v8::Arguments& args);
        static v8::Handle<v8::Value> AddClipPath(const v8::Arguments& args);
        static v8::Handle<v8::Value> SetFillTypes(const v8::Arguments& args);
        static v8::Handle<v8::Value> SetFactor(const v8::Arguments& args);
        static v8::Handle<v8::Value> Union(const v8::Arguments& args);
        static v8::Handle<v8::Value> Intersection(const v8::Arguments& args);
        static v8::Handle<v8::Value> Difference(const v8::Arguments& args);
        static v8::Handle<v8::Value> Xor(const v8::Arguments& args);
        static v8::Persistent<v8::Function> constructor;
        static bool do_clipping_operation(const v8::Arguments& args, ClipperWrap &obj, v8::Handle<v8::Array> &final, ClipperLib::ClipType type);
        ClipperLib::Clipper clipper_;
        ClipperLib::PolyFillType subj_fill_;
        ClipperLib::PolyFillType clip_fill_;
        double factor_;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utilities Prototypes

ClipperLib::PolyFillType get_polyfilltype(double value);
void get_vertices_from_path(ClipperLib::Path &path, v8::Handle<v8::Array> &array, double factor);
void get_clip_solution(ClipperLib::PolyTree &solution, v8::Handle<v8::Array> &polygons, v8::Handle<v8::Array> &polylines, double factor);
bool add_path(const v8::Arguments& args, ClipperLib::Clipper &clipper, v8::Local<v8::Array> &vertices, ClipperLib::PolyType type, bool closed, double factor);
void handle_exception(const v8::Arguments& args, v8::Local<v8::Value> e);

v8::Handle<v8::Value> compute_area(const v8::Arguments& args);

#endif