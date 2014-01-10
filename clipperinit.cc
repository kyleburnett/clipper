#include <node.h>
#include <v8.h>
#include "src/clipper.hpp"
#include "src/clipper.cpp"

#define DEFAULT_SCALE 10000

using namespace node;
using namespace v8;
using namespace ClipperLib;

v8::Handle<Value> Simplify(const Arguments& args) {
	const int scaleFactor = (args.Length() > 1) ? ((args[1]->IsNumber()) ? v8::Number::Cast(*args[1])->Value() : DEFAULT_SCALE ) : DEFAULT_SCALE;
	v8::HandleScope scope;

    // Check to make sure that the first argument is an array of even length
	if (args[0]->IsArray() && v8::Array::Cast(*args[0])->Length() % 2 == 0) {
		try {
			// Cast our first argument as an array
			v8::Local<v8::Array> points = v8::Array::Cast(*args[0]);

			ClipperLib::Polygon polygon;
			ClipperLib::Polygons polysout;

			// Construct the shape using the array of points
			for (int i = 0, limiti = points->Length(); i < limiti; i += 2) {
				v8::Local<v8::Value> pairA = points->Get(i);
				v8::Local<v8::Value> pairB = points->Get(i+1);
				// Push point onto polygon with scale factor
				polygon.push_back(
					IntPoint(
						(int)(pairA->NumberValue() * scaleFactor),
						(int)(pairB->NumberValue() * scaleFactor)
					)
				);
			}

			// Clean polygon
			CleanPolygon(polygon, polygon); 

			// Simplify polygon
			SimplifyPolygon(polygon, polysout, pftNonZero);
			
			// Get the resultant simplified polygons
			Local<Object> obj = Object::New();
			// Create array containers for Outer Polygons and Inner Polygons (holes)
			Handle<Array> outPolygons = Array::New();
			Handle<Array> inPolygons = Array::New();
			for (std::vector<ClipperLib::Polygon>::iterator polyiter = polysout.begin(); polyiter != polysout.end(); ++polyiter) {
				// For each point in the polygon
				Handle<Array> points = Array::New();
				for (std::vector<IntPoint>::iterator iter = polyiter->begin(); iter != polyiter->end(); ++iter) {
					// Retrieve the points and undo scale
					v8::Local<v8::Number> x = v8::Number::New((double)iter->X / scaleFactor);
					v8::Local<v8::Number> y = v8::Number::New((double)iter->Y / scaleFactor);
					points->Set(points->Length(), x);
					points->Set(points->Length(), y);
				}

				// If the orientation of polygon returns true, it is an outer polygon
				if (Orientation(*polyiter)) outPolygons->Set(outPolygons->Length(), points);
				// Otherwise it is an inner polygon (a hole)
				else inPolygons->Set(inPolygons->Length(), points);
			}

			// Set in/out properties for return object
			obj->Set(String::NewSymbol("out"), outPolygons);
			obj->Set(String::NewSymbol("in"), inPolygons);

			return scope.Close(obj);
		} catch (...) {
			return scope.Close(v8::Boolean::New(false));
		}
	}

	return scope.Close(v8::Boolean::New(false));
}

extern "C" {
	static void init(Handle<Object> target) {
		// Setup simplify function
		target->Set(String::NewSymbol("simplify"),
			FunctionTemplate::New(Simplify)->GetFunction());
	}
	NODE_MODULE(clipper, init)
}