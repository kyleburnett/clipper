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
    |   |-> addSubjectPath()
    |   |-> addClipPath()
    |   `-> union()
    |-> area()
    |-> clean()
    |-> cleanAll()
    |-> simplify()
    `-> simplifyAll()

In the documentation below, the variable `clipper` is used to denote the object returned from `require('clipper');`, while the variable `op` is the object returned from a `clipper.begin()` call.

Clipping Operation Module
-------

#### clipper.begin([callback]);

Starts a new clipper operation. This also sets both the subject and clip fill types to EVENODD.

#### op.setFillTypes(subjFillType[, clipFillType][, callback]);

Sets the subject fill type (and optionally the clip fill type). Use the values defined in clipper.PolyFillType. For example:

    op.setFillTypes(clipper.PolyFillType.POSITIVE);

Possible fill types are EVENODD, NONZERO, POSITIVE, and NEGATIVE.

#### op.addSubjectPath(path, closed[, callback]);

Adds an open or closed subject path to the the clipping operation. The path should be a list of (x, y) vertices given in an array.

#### op.addClipPath(path[, callback]);

Adds a clip path to the clipping operation. The path should be a list of (x, y) vertices given in an array.

Utility Function Module
-------

TODO: implement/document utility functions
