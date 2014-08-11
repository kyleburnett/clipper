var clipper = require('../');

function test_methods(obj) {
    var methods = ['addSubjectPath', 'addClipPath', 'union', 'intersection', 'difference', 'xor'];
    methods.forEach(function(value) {
        expect(obj).to.respondTo(value);
    });
}

var types = clipper.PolyFillType;

describe('clipper.begin', function() {
    it('should return a default clipper object', function() {
        var clip = clipper.begin();
        test_methods(clip);
    });

    it('should return a clipper object for different PolyFillTypes', function() {
        var clip1 = clipper.begin(types.EVENODD, types.EVENODD);
        test_methods(clip1);
        var clip2 = clipper.begin(types.NONZERO, types.NONZERO);
        test_methods(clip2);
        var clip3 = clipper.begin(types.POSITIVE, types.POSITIVE);
        test_methods(clip3);
        var clip4 = clipper.begin(types.NEGATIVE, types.NEGATIVE);
        test_methods(clip4);
    });

    it('should return a clipper object specifying only the subject PolyFillType', function() {
        var clip1 = clipper.begin(types.EVENODD);
        test_methods(clip1);
        var clip2 = clipper.begin(types.NONZERO);
        test_methods(clip2);
        var clip3 = clipper.begin(types.POSITIVE);
        test_methods(clip3);
        var clip4 = clipper.begin(types.NEGATIVE);
        test_methods(clip4);
    });

    it('should be able to use promises', function () {
        var clipperAsync = clipper.usePromises;
        return clipperAsync.begin().then(function(clip) {
            test_methods(clip);
        });
    });
});