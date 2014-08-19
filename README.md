clipper
=======

[![Build Status](https://travis-ci.org/kyleburnett/clipper.svg?branch=update-api)](https://travis-ci.org/kyleburnett/clipper)

Node binding to C++ clipping library found at [http://www.angusj.com/delphi/clipper.php](http://www.angusj.com/delphi/clipper.php)

Installation and use
-------

Add the module to your package dependencies:

    npm install clipper --save

Use the module:
    
    var clipper = require('clipper');

Api Overview
-------

This library can be divided up into two parts. The first part is the clipping operation module. A clipping operation is initiated with a call to begin(). The returned object contains several function prototypes of its own.

The second part comprises a collection of utility functions that clipper provides for operating on paths in various ways.

This is illustrated in the following diagram:

    clipper
    |-> begin():
    |   |-> setFillTypes()
    |   |-> setFactor()
    |   |-> addSubjectPath()
    |   |-> addClipPath()
    |   |-> union()
    |   |-> intersection()
    |   |-> difference()
    |   `-> xor()
    |-> area()
    |-> clean()
    |-> cleanAll()
    |-> simplify()
    `-> simplifyAll()

In the documentation below, the variable `clipper` is used to denote the object returned from `require('clipper');`, while the variable `op` is the object returned from a `clipper.begin()` call. Also note that when a path is given as a parameter or return type, it always refers to an array of path vertices like `[x_0, y_0, x_1, y_1, x_2, y_2, ...]`. `paths` refers to an array of multiple `path`s.

Clipping Operation Module
-------

#### clipper.area(path[, callback]);

Computes the area of the given polygon.

#### clipper.begin([callback]);

Starts a new clipper operation. This also sets both the subject and clip fill types to EVENODD.

#### op.setFillTypes(subjFillType[, clipFillType][, callback]);

Sets the subject fill type (and optionally the clip fill type). Use the values defined in clipper.PolyFillType. For example:

    op.setFillTypes(clipper.PolyFillType.POSITIVE);

Possible fill types are EVENODD, NONZERO, POSITIVE, and NEGATIVE.

#### op.setFactor(factor[, callback]);

Sets the factor used to transform each coordinate. Useful when the coordinates are given in small units such as `[0.0, 0.0, 0.010, 0.0, 0.010, 0.010, 0.0, 0.010]`. Clipper works in integers, so the coordinates must be scalled up. For example, the factor could be set to 1000. The result from any clipping operation will return any results inte original scale.

#### op.addSubjectPath(path, closed[, callback]);

Adds an open or closed subject path to the the clipping operation. The path should be a list of (x, y) vertices given in an array.

#### op.addClipPath(path[, callback]);

Adds a clip path to the clipping operation. The path should be a list of (x, y) vertices given in an array.

#### op.union([callback]);

Performs the union operation. Returns an array of size 2. The first element is an array of all closed paths; the second element is an array of all open paths.

#### op.intersection([callback]);

Performs the intersection operation. Returns an array of size 2. The first element is an array of all closed paths; the second element is an array of all open paths.

#### op.difference([callback]);

Performs the difference operation. Returns an array of size 2. The first element is an array of all closed paths; the second element is an array of all open paths.

#### op.xor([callback]);

Performs the xor operation. Returns an array of size 2. The first element is an array of all closed paths; the second element is an array of all open paths.

Utility Function Module
-------

#### clipper.clean(path[, factor=1.0[, distance=1.415]][, callback]);

Performs the clean operation, which does the following:

1. Removes vertices that join co-linear edges, or join edges that are almost co-linear.
2. Removes vertices that are within the specified distance of an adjacent vertex.
3. Removes vertices that are within a specified distance of a semi-adjacent vertex together with their out-lying vertices.

Returns a path. Please see the [CleanPolygon Documentation](http://www.angusj.com/delphi/clipper/documentation/Docs/Units/ClipperLib/Functions/CleanPolygon.htm) for examples.

#### clipper.cleanAll(paths[, factor=1.0[,distance=1.415]][, callback]);

Performs the clean operation as above, except with multiple closed paths. Returns a paths array.

#### clipper.simplify(path[, factor=1.0][, PolyFillType=EVENODD][, callback]);

Removes self-intersections from the supplied polygon (by performing a boolean union operation using the nominated PolyFillType).
Polygons with non-contiguous duplicate vertices (ie 'touching') will be split into two polygons. Returns a paths array. Please see the [SimplifyPolygon Documentation](http://www.angusj.com/delphi/clipper/documentation/Docs/Units/ClipperLib/Functions/SimplifyPolygon.htm) for examples.

#### clipper.simplifyAll(paths[, factor=1.0][, callback]);

Performs the simplify operation as above, except with multiple closed paths. Returns a paths array.
