var clipper = require('../');
var should = require('should');

describe('Clipper', function () {
    describe('union()', function () {
        it('should return false if no arguments are specified', function () {
            clipper.union().should.be.false;
        });
        it('should return false if the first argument is not an array', function () {
            clipper.union(10).should.be.false;
        });
        it('should return false if the array of vertices is missing a coordinate', function () {
            clipper.union([10,10,100,10,100,100,10,100,10]).should.be.false;
        });
        it('should properly compute the union of two intersecting polygons', function () {
            clipper.union([
                0, 0,
                10, 0,
                10, 10,
                0, 10
            ], [
                5, 5,
                15, 5,
                15, 15,
                5, 15
            ]).should.eql({
                "out": [ [ 10, 0, 10, 5, 15, 5, 15, 15, 5, 15, 5, 10, 0, 10, 0, 0 ] ],
                "in": []
            });
        });
        it('should properly compute the union of two disjoint polygons', function () {
            clipper.union([
                0, 0,
                10, 0,
                10, 10,
                0, 10
            ], [
                15, 15,
                25, 15,
                25, 25,
                15, 25
            ]).should.eql({
                "out": [ [ 25, 15, 25, 25, 15, 25, 15, 15 ],[ 10, 0, 10, 10, 0, 10, 0, 0 ] ],
                "in": []
            });
        });
        it('should properly compute the union where two polygons are equal', function () {
            clipper.union([
                0, 0,
                10, 0,
                10, 10,
                0, 10
            ], [
                0, 0,
                10, 0,
                10, 10,
                0, 10
            ], [
                15, 15,
                25, 15,
                25, 25,
                15, 25
            ]).should.eql({
                "out": [ [ 25, 15, 25, 25, 15, 25, 15, 15 ],[ 10, 0, 10, 10, 0, 10, 0, 0 ] ],
                "in": []
            });
        });
    });
});