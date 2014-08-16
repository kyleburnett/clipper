var clipper = require('../');

Promise.promisifyAll(clipper);

var clip1 = clipper.begin();

function wrap(clip, args) {
    return function() {
        clip.setFactor.apply(clip, args);
    }
}

var types = clipper.PolyFillType;

describe('#setFillTypes()', function() {
    it('should throw an error if the wrong number of arguments is given', function() {
        expect(wrap(clip1, [])).to.throw(Error, 'Requires 1 or 2 arguments');
    });

    it('should throw an error if the first argument is not a number', function() {
        var args1 = [true];
        var args2 = [
            []
        ];
        var args3 = ['str'];
        var args4 = [null];
        var args5 = [{
            prop: 'one'
        }];
        expect(wrap(clip1, args1)).to.throw(TypeError, 'Wrong type for argument 1: expected number');
        expect(wrap(clip1, args2)).to.throw(TypeError, 'Wrong type for argument 1: expected number');
        expect(wrap(clip1, args3)).to.throw(TypeError, 'Wrong type for argument 1: expected number');
        expect(wrap(clip1, args4)).to.throw(TypeError, 'Wrong type for argument 1: expected number');
        expect(wrap(clip1, args5)).to.throw(TypeError, 'Wrong type for argument 1: expected number');
    });

    it('should set the factor for the clipping operation', function() {
        expect(clip1.setFactor(1000)).to.be.undefined;
    });
});