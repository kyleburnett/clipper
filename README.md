clipper
=======

Node binding to C++ clipping library found at [http://www.angusj.com/delphi/clipper.php](http://www.angusj.com/delphi/clipper.php)

Installation
-------

To install this clipper module, perform the following:

1. Add `clipper: <version>` to your package.json
2. Use the command `npm install`

Use
-------

    var clipper = require('clipper');
    
    // clipper will use the default distance 1.415 when cleaning the polygon
    clipper.simplify([10,10,100,10,100,100,10,100,10,50], 1);

API
-------

### simplify(coords[, scale_factor])
 * <i>coords</i>: and array of vertices
 * <i>scale_factor</i>: the factor by which to scale each coordinate in <i>coords</i>
