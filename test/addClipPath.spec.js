var clipper = require('../');

Promise.promisifyAll(clipper);

var clip1 = clipper.begin();
var poly1 = [0, 0, 10, 0, 10, 10, 0, 10];
var poly2 = [5, 5, 15, 5, 15, 15, 5, 15];

function wrap(clip, args) {
    return function() {
        clip.addClipPath.apply(clip, args);
    };
}

describe('#addClipPath()', function() {
    it('should throw an error if no arguments are provided', function() {
        expect(wrap(clip1, [])).to.throw(TypeError, 'Wrong type for argument 1: expected array');
    });

    it('should throw an error if the first argument is not an array', function() {
        var args1 = [true];
        var args2 = [0];
        var args3 = ['str'];
        var args4 = [null];
        var args5 = [{
            prop: 'one'
        }];
        expect(wrap(clip1, args1)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(clip1, args2)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(clip1, args3)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(clip1, args4)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
        expect(wrap(clip1, args5)).to.throw(TypeError, 'Wrong type for argument 1: expected array');
    });

    it('should throw an error if vertex array is the wrong size', function() {
        var args = [[0, 0, 10, 0, 10, 10, 0]];
        expect(wrap(clip1, args)).to.throw(Error, 'Wrong number of vertex coordinates in list');
    });

    it('should throw an error if the vertex array has less than 2 vertices', function() {
        var args = [[0, 0]];
        expect(wrap(clip1, args)).to.throw(Error, 'An error occurred when attempting to add a path');
    });

    it('should add a polygon clip path to the clipper object', function() {
        expect(clip1.addClipPath(poly1)).to.be.undefined;
    });

    it('should add another polygon clip path to the clipper object', function() {
        expect(clip1.addClipPath(poly2)).to.be.undefined;
    });

    it('should be able to use callbacks', function(done) {
        clip1.addClipPath(poly1, function(err, value) {
            expect(err).to.be.false;
            expect(value).to.be.undefined;
            done();
        });
    });

    it('should be able to use callbacks to catch errors', function(done) {
        clip1.addClipPath([0, 0, 10, 0, 10, 10, 0], function(err, value) {
            expect(err).to.eql(new Error('Wrong number of vertex coordinates in list'));
            expect(value).to.be.undefined;
            done();
        });
    });

    it('should be able to use promises', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return clip.addClipPathAsync(poly1).then(function(value) {
                expect(value).to.be.undefined;
            });
        });
    });

    it('should be able catch errors with promises', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return clip.addClipPathAsync([0, 0, 10, 0, 10, 10, 0]);
        }).should.be.rejectedWith(Error, 'Wrong number of vertex coordinates in list');
    });
});