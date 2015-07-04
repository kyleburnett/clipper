var clipper = require('../');

Promise.promisifyAll(clipper);

function wrap(args) {
    return function() {
        clipper.area.apply(null, args);
    };
}

describe('clipper.area()', function() {
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

    it('should correctly compute the area of a square', function() {
        var poly = [0, 0, 10, 0, 10, 10, 0, 10];
        expect(clipper.area(poly)).to.eql(100);
    });

    it('should correctly compute the area of a scaled square', function() {
        var poly = [0.0, 0.0, 0.01, 0.0, 0.01, 0.01, 0.0, 0.01];
        expect(clipper.area(poly, 1000)).to.eql(0.0001);
    });

    it('should correctly compute the area of a square with a callback', function(done) {
        var poly = [0, 0, 10, 0, 10, 10, 0, 10];
        clipper.area(poly, function(err, area) {
            expect(area).to.eql(100);
            done();
        });
    });

    it('should correctly compute the area of a square using promises', function() {
        var poly = [0, 0, 10, 0, 10, 10, 0, 10];
        return clipper.areaAsync(poly).then(function(area) {
            expect(area).to.eql(100);
        });
    });

    it('should correctly compute the area of a scaled square with a callback', function(done) {
        var poly = [0.0, 0.0, 0.01, 0.0, 0.01, 0.01, 0.0, 0.01];
        clipper.area(poly, 1000, function(err, area) {
            expect(area).to.eql(0.0001);
            done();
        });
    });

    it('should correctly compute the area of a scaled square using promises', function() {
        var poly = [0.0, 0.0, 0.01, 0.0, 0.01, 0.01, 0.0, 0.01];
        return clipper.areaAsync(poly, 1000).then(function(area) {
            expect(area).to.eql(0.0001);
        });
    });

    it('should be able to use callbacks to catch errors', function(done) {
        clipper.area(true, function(err, area) {
            expect(err).to.eql(new Error('Wrong type for argument 1: expected array'));
            expect(area).to.be.undefined;
            done();
        });
    });

    it('should be able to catch errors with promises', function() {
        return clipper.areaAsync(true).should.be.rejectedWith(Error, 'Wrong type for argument 1: expected array');
    });
});