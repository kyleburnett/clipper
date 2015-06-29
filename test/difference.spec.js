var clipper = require('../');

Promise.promisifyAll(clipper);

var types = clipper.PolyFillType;
var poly1 = [0, 0, 10, 0, 10, 10, 0, 10];
var poly2 = [5, 5, 15, 5, 15, 15, 5, 15];

describe('#difference', function() {
    it('should return the difference of two polygons', function() {
        var clip = clipper.begin();
        clip.setFillTypes(types.POSITIVE, types.POSITIVE);
        clip.addSubjectPath(poly1, true);
        clip.addClipPath(poly2);
        expect(clip.difference()).to.eql([
            [
                [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
            ],
            []
        ]);
    });

    it('should return the difference of two polygons using callbacks', function(done) {
        var clip = clipper.begin();
        clip.setFillTypes(types.POSITIVE, types.POSITIVE);
        clip.addSubjectPath(poly1, true);
        clip.addClipPath(poly2);
        clip.difference(function(err, result) {
            expect(result).to.eql([
                [
                    [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
                ],
                []
            ]);
            done();
        });
    });

    it('should return the difference of two polygons with promises', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return Promise.all([
                clip.setFillTypesAsync(types.POSITIVE, types.POSITIVE),
                clip.addSubjectPathAsync(poly1, true),
                clip.addClipPathAsync(poly2)
            ]).then(function() {
                return clip.differenceAsync();
            }).spread(function(closed, open) {
                expect(closed).to.eql([
                    [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
                ]);
            });
        });
    });
});