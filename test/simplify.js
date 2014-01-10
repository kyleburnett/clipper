var clipper = require('../');
var should = require('should');

describe('Clipper', function () {
    describe('simplify()', function () {
        it('should return false if no arguments are specified', function () {
            clipper.simplify().should.be.false;
        });
        it('should return false if the first argument is not an array', function () {
            clipper.simplify(10, 1).should.be.false;
        });
        it('should return false if the array of vertices is missing a coordinate', function () {
            clipper.simplify([10,10,100,10,100,100,10,100,10], 1).should.be.false;
        });
        it('should properly remove (clean) unnecessary vertices', function () {
            clipper.simplify([10,10,100,10,100,100,10,100,10,50], 1).should.eql(
            {
                "out": [ [ 100, 10, 100, 100, 10, 100, 10, 10 ] ],
                "in": []
            });
            clipper.simplify([10,10,100,10,100,100,10,100,99,99], 1).should.eql(
            {
                "out": [ [100, 10, 100, 100, 10, 10] ],
                "in": []
            });
        });
        it('should properly simplify polygons', function () {
            clipper.simplify([145, 20, 220, 450, 20, 110, 265, 110, 65, 250], 1).should.eql(
            { "out":
                [ [ 145,
                    20,
                    161,
                    110,
                    265,
                    110,
                    172,
                    175,
                    220,
                    450,
                    91,
                    231,
                    65,
                    250,
                    79,
                    210,
                    20,
                    110,
                    114,
                    110 ] ],
                "in": [] });
            clipper.simplify([30, 20, 140, 40, 120, 100, 255, 170, 165, 310, 85, 235, 120, 100, 40, 80], 1).should.eql(
            { "out":
                    [ [ 120, 100, 255, 170, 165, 310, 85, 235 ],
                    [ 120, 100, 40, 80, 30, 20, 140, 40 ] ],
                "in": [] });
            clipper.simplify([150, 20, 245, 45, 205, 220, 85, 220, 20, 55, 150, 20, 110, 120, 180, 120], 1).should.eql(
            { out: [ [ 150, 20, 245, 45, 205, 220, 85, 220, 20, 55 ] ],
                in: [ [ 150, 20, 110, 120, 180, 120 ] ] });
        });
    });
});