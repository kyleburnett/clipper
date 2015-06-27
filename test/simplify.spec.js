var clipper = require('../');

Promise.promisifyAll(clipper);

function wrap(args) {
    return function() {
        clipper.simplify.apply(null, args);
    };
}

describe('clipper.simplify()', function() {
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
    // - http://www.angusj.com/delphi/clipper/documentation/Docs/Units/ClipperLib/Functions/SimplifyPolygon.htm
    // - Accessed 6/27/2015
    // - Star example
    it('should correctly simplify a polygon with self-intersections (star)', function() {
        var poly = [480, 120, 600, 515, 285, 275, 675, 275, 360, 515];
        expect(clipper.simplify(poly, 1.0, clipper.PolyFillType.POSITIVE)).to.eql([
            [
                [
                    527, 275, 675, 275, 555, 367, 600, 515, 480, 424,
                    360, 515, 405, 367, 285, 275, 433, 275, 480, 120
                ]
            ],
            []
        ]);
    });

    it('should correctly scale the vertices', function() {
        var poly = [0.480, 0.120, 0.600, 0.515, 0.285, 0.275, 0.675, 0.275, 0.360, 0.515];
        expect(clipper.simplify(poly, 1000, clipper.PolyFillType.POSITIVE)).to.eql([
            [
                [
                    0.527, 0.275, 0.675, 0.275, 0.555, 0.367, 0.600, 0.515, 0.480, 0.424,
                    0.360, 0.515, 0.405, 0.367, 0.285, 0.275, 0.433, 0.275, 0.480, 0.120
                ]
            ],
            []
        ]);
    });

    it('should correctly simplify a polygon with a callback', function(done) {
        var poly = [480, 120, 600, 515, 285, 275, 675, 275, 360, 515];
        clipper.simplify(poly, 1.0, clipper.PolyFillType.POSITIVE, function(err, result) {
            expect(result).to.eql([
                [
                    [
                        527, 275, 675, 275, 555, 367, 600, 515, 480, 424,
                        360, 515, 405, 367, 285, 275, 433, 275, 480, 120
                    ]
                ],
                []
            ]);
            done();
        });
    });

    it('should correctly simplify a polygon using promises', function() {
        var poly = [480, 120, 600, 515, 285, 275, 675, 275, 360, 515];
        return clipper.simplifyAsync(poly, 1.0, clipper.PolyFillType.POSITIVE).spread(function(outer, hole) {
            expect(outer).to.eql([
                [
                    527, 275, 675, 275, 555, 367, 600, 515, 480, 424,
                    360, 515, 405, 367, 285, 275, 433, 275, 480, 120
                ]
            ]);
            expect(hole).to.eql([]);
        });
    });

    it('should be able to use callbacks to catch errors', function(done) {
        clipper.simplify(true, function(err, cleaned) {
            expect(err).to.eql(new Error('Wrong type for argument 1: expected array'));
            expect(cleaned).to.be.undefined;
            done();
        });
    });

    it('should be able to catch errors with promises', function() {
        return clipper.simplifyAsync(true).should.be.rejectedWith(Error, 'Wrong type for argument 1: expected array');
    });
});