var clipper = require('../');

function test_methods(obj) {
    var methods = ['addSubjectPath', 'addClipPath', 'union', 'intersection', 'difference', 'xor'];
    methods.forEach(function(value) {
        expect(obj).to.respondTo(value);
    });
}

var types = clipper.PolyFillType;

Promise.promisifyAll(clipper);

describe('clipper.begin()', function() {
    it('should return a default clipper object', function() {
        var clip = clipper.begin();
        test_methods(clip);
    });

    it('should return a clipper object in a callback', function(done) {
        clipper.begin(function(err, clip) {
            test_methods(clip);
            done();
        });
    });

    it('should return a clipper object in a promise resolution', function() {
        return clipper.beginAsync().then(function(clip) {
            test_methods(clip);
        });
    });
});