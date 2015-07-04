var clipper = require('../');

Promise.promisifyAll(clipper);

function wrap(args) {
    return function() {
        clipper.orientation.apply(null, args);
    };
}

describe('clipper.orientation()', function() {
    it('should throw an error if no arguments are provided', function() {
        expect(wrap([])).to.throw(TypeError, 'Wrong type for argument 1: expected array');
    });

    it('should throw an error if the first argument is the wrong type', function() {
        var args1 = [true];
        var args2 = [0];
        var args3 = ['str'];
        var args4 = [null];
        var args5 = [{
            prop: 'one'
        }];
        expect(wrap(args1)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(args2)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(args3)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(args4)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(args5)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
    });

    it('should return true if the polygon is an outer polygon', function() {
        var path = [0, 10, 10, 0, 20, 10, 10, 20];
        expect(clipper.orientation(path)).to.be.true;
    });

    it('should return false if the polygon is a hole polygon', function() {
        var path = [15, 10, 5, 10, 10, 20];
        expect(clipper.orientation(path)).to.be.false;
    });

    it('should accept a factor as an argument', function() {
        var path = [0, 0.10, 0.10, 0, 0.20, 0.10, 0.10, 0.20];
        expect(clipper.orientation(path, 100)).to.be.true;
    });

    it('should correctly get the orientation boolean in a callback', function(done) {
        var path = [0, 10, 10, 0, 20, 10, 10, 20];
        clipper.orientation(path, function(err, value) {
            expect(value).to.be.true;
            done();
        });
    });

    it('should correctly get the orientation boolean using promises', function() {
        var path = [0, 10, 10, 0, 20, 10, 10, 20];
        return clipper.orientationAsync(path).then(function(value) {
            expect(value).to.be.true;
        });
    });
});