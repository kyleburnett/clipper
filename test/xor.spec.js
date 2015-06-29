var clipper = require('../');

Promise.promisifyAll(clipper);

var types = clipper.PolyFillType;
var poly1 = [0, 0, 10, 0, 10, 10, 0, 10];
var poly2 = [5, 5, 15, 5, 15, 15, 5, 15];

describe('#xor', function() {
    it('should return the xor of two polygons', function() {
        var clip = clipper.begin();
        clip.setFillTypes(types.POSITIVE, types.POSITIVE);
        clip.addSubjectPath(poly1, true);
        clip.addClipPath(poly2);
        expect(clip.xor()).to.eql([
            [
                [15, 15, 5, 15, 5, 10, 10, 10, 10, 5, 15, 5],
                [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
            ],
            []
        ]);
    });

    it('should return the xor of two polygons using callbacks', function(done) {
        var clip = clipper.begin();
        clip.setFillTypes(types.POSITIVE, types.POSITIVE);
        clip.addSubjectPath(poly1, true);
        clip.addClipPath(poly2);
        clip.xor(function(err, result) {
            expect(result).to.eql([
                [
                    [15, 15, 5, 15, 5, 10, 10, 10, 10, 5, 15, 5],
                    [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
                ],
                []
            ]);
            done();
        });
    });

    it('should return the xor of two polygons with promises', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return Promise.all([
                clip.setFillTypesAsync(types.POSITIVE, types.POSITIVE),
                clip.addSubjectPathAsync(poly1, true),
                clip.addClipPathAsync(poly2)
            ]).then(function() {
                return clip.xorAsync();
            }).spread(function(closed, open) {
                expect(closed).to.eql([
                    [15, 15, 5, 15, 5, 10, 10, 10, 10, 5, 15, 5],
                    [10, 5, 5, 5, 5, 10, 0, 10, 0, 0, 10, 0]
                ]);
            });
        });
    });
});