/**
 * Expose should to external world.
 */

var Promise = require('bluebird');
var clipper = require('../build/Release/clipper');
 
exports = module.exports = clipper;

exports.PolyFillType = {
    EVENODD: 0,
    NONZERO: 1,
    POSITIVE: 2,
    NEGATIVE: 3
};

function ClipperAsPromised(res) {
    this._res = res;
}
ClipperAsPromised.prototype.addSubjectPath = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.addSubjectPath.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
};
ClipperAsPromised.prototype.addClipPath = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.union.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
}
ClipperAsPromised.prototype.union = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.union.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
}
ClipperAsPromised.prototype.intersection = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.union.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
}
ClipperAsPromised.prototype.difference = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.union.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
}
ClipperAsPromised.prototype.xor = function() {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
        try {
            resolve(self._res.union.apply(self._res, args));
        } catch (e) {
            reject(e);
        }
    });
}

function promisify(res) {
    var obj = new ClipperAsPromised(res);
    return obj;
}

exports.usePromises = {
    begin: function() {
        var res = exports.begin.apply(null, arguments);
        var resPromise = promisify(res);
        return Promise.resolve(resPromise);
    }
}