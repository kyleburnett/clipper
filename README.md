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
    |   `-> addClipPath()
    |-> area()
    |-> clean()
    |-> cleanAll()
    |-> simplify()
    `-> simplifyAll()

TODO: document clipping operation module

TODO: document utility function module
