var clipper = require('../');

Promise.promisifyAll(clipper);

function wrap(args) {
    return function() {
        clipper.clean.apply(null, args);
    };
}

describe('clipper.clean()', function() {
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

    // From Delphi website:
    // - http://www.angusj.com/delphi/clipper/documentation/Docs/Units/ClipperLib/Functions/CleanPolygon.htm
    // - Accessed 6/27/2015
    // - First example
    it('should correctly clean a polygon with co-linear edges', function() {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 10, 50];
        expect(clipper.clean(poly)).to.eql([10, 10, 100, 10, 100, 100, 10, 100]);
    });

    // From Delphi website:
    // - http://www.angusj.com/delphi/clipper/documentation/Docs/Units/ClipperLib/Functions/CleanPolygon.htm
    // - Accessed 6/27/2015
    // - Second example
    it('should correctly clean a polygon with semi adjacent vertices', function() {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 99, 99];
        expect(clipper.clean(poly)).to.eql([10, 10, 100, 10, 100, 100]);
    });

    it('should properly scale the vertices', function() {
        var poly = [0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100, 0.010, 0.050];
        expect(clipper.clean(poly, 1000)).to.eql([
            0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100
        ]);
    });

    it('should accept a distance factor', function() {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 99, 99];
        // Making the distance factor very small means that the close vertex will not be removed.
        expect(clipper.clean(poly, 1.0, 0.01)).to.eql(poly);
    });

    it('should correctly clean a polygon with a callback', function(done) {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 10, 50];
        clipper.clean(poly, function(err, cleaned) {
            expect(cleaned).to.eql([10, 10, 100, 10, 100, 100, 10, 100]);
            done();
        });
    });

    it('should correctly clean a polygon using promises', function() {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 10, 50];
        return clipper.cleanAsync(poly).then(function(cleaned) {
            expect(cleaned).to.eql([10, 10, 100, 10, 100, 100, 10, 100]);
        });
    });

    it('should correctly clean a scaled polygon with a callback', function(done) {
        var poly = [0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100, 0.010, 0.050];
        clipper.clean(poly, 1000, function(err, cleaned) {
            expect(cleaned).to.eql([0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100]);
            done();
        });
    });

    it('should correctly clean a scaled polygon using promises', function() {
        var poly = [0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100, 0.010, 0.050];
        return clipper.cleanAsync(poly, 1000).then(function(cleaned) {
            expect(cleaned).to.eql([0.010, 0.010, 0.100, 0.010, 0.100, 0.100, 0.010, 0.100]);
        });
    });

    it('should accept a distance factor and use a callback', function(done) {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 99, 99];
        clipper.clean(poly, 1.0, 0.01, function(err, cleaned) {
            expect(cleaned).to.eql(poly);
            done();
        });
    });

    it('should accept a distance factor using promises', function() {
        var poly = [10, 10, 100, 10, 100, 100, 10, 100, 99, 99];
        return clipper.cleanAsync(poly, 1.0, 0.01).then(function(cleaned) {
            expect(cleaned).to.eql(poly);
        });
    });

    it('should be able to use callbacks to catch errors', function(done) {
        clipper.clean(true, function(err, cleaned) {
            expect(err).to.eql(new Error('Wrong type for argument 1: expected array'));
            expect(cleaned).to.be.undefined;
            done();
        });
    });

    it('should be able to catch errors with promises', function() {
        return clipper.cleanAsync(true).should.be.rejectedWith(Error, 'Wrong type for argument 1: expected array');
    });
});