/**
 * Expose to external world.
 */

var clipper = require('../build/Release/clipper');
 
exports = module.exports = clipper;

exports.PolyFillType = {
    EVENODD: 0,
    NONZERO: 1,
    POSITIVE: 2,
    NEGATIVE: 3
};