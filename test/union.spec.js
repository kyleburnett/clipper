var clipper = require('../');

var types = clipper.PolyFillType;
var poly1 = [0, 0, 10, 0, 10, 10, 0, 10];
var poly2 = [5, 5, 15, 5, 15, 15, 5, 15];

describe('#union', function() {
    // it('should return the union of two polygons', function() {
    //     var clip = clipper.begin();
    //     clip.addSubjectPath(poly1, true);
    //     clip.addSubjectPath(poly2, true);
    //     expect(clip.union()).to.eql([
    //         [ [ 10, 5, 15, 5, 15, 15, 5, 15, 5, 10, 0, 10, 0, 0, 10, 0 ] ], []
    //     ]);
    // });

    // it('should return the union of two polygons with promises', function() {
    //     var clipAsync = clipper.usePromises;
    //     return clipAsync.begin(types.POSITIVE).then(function(clip) {
    //         return Promise.all([
    //             clip.addSubjectPath(poly1, true),
    //             clip.addSubjectPath(poly2, true)
    //         ]).then(function() {
    //             return clip.union();
    //         }).spread(function(closed, open) {
    //             expect(closed).to.eql([ [ 10, 5, 15, 5, 15, 15, 5, 15, 5, 10, 0, 10, 0, 0, 10, 0 ] ]);
    //         });
    //     });
    // });
});