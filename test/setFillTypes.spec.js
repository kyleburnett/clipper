var clipper = require('../');

Promise.promisifyAll(clipper);

var clip1 = clipper.begin();

function wrap(clip, args) {
    return function() {
        clip.setFillTypes.apply(clip, args);
    }
}

var types = clipper.PolyFillType;

describe('#setFillTypes()', function() {
    it('should throw an error if the wrong number of arguments is given', function() {
        expect(wrap(clip1, [])).to.throw(Error, 'Requires 1 to 3 arguments');
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

    it('should throw an error if the second argument is not a number or function', function() {
        var args1 = [types.EVENODD, true];
        var args2 = [types.EVENODD, []];
        var args3 = [types.EVENODD, 'str'];
        var args4 = [types.EVENODD, null];
        var args5 = [types.EVENODD, {
            prop: 'one'
        }];
        expect(wrap(clip1, args1)).to.throw(TypeError, 'Wrong type for argument 2: expected number or function');
        expect(wrap(clip1, args2)).to.throw(TypeError, 'Wrong type for argument 2: expected number or function');
        expect(wrap(clip1, args3)).to.throw(TypeError, 'Wrong type for argument 2: expected number or function');
        expect(wrap(clip1, args4)).to.throw(TypeError, 'Wrong type for argument 2: expected number or function');
        expect(wrap(clip1, args5)).to.throw(TypeError, 'Wrong type for argument 2: expected number or function');
    });

    it('should throw an error if the third argument is not a function', function() {
        var args1 = [types.EVENODD, types.EVENODD, true];
        var args2 = [types.EVENODD, types.EVENODD, []];
        var args3 = [types.EVENODD, types.EVENODD, 'str'];
        var args4 = [types.EVENODD, types.EVENODD, null];
        var args5 = [types.EVENODD, types.EVENODD, {
            prop: 'one'
        }];
        expect(wrap(clip1, args1)).to.throw(TypeError, 'Wrong type for argument 3: expected function');
        expect(wrap(clip1, args2)).to.throw(TypeError, 'Wrong type for argument 3: expected function');
        expect(wrap(clip1, args3)).to.throw(TypeError, 'Wrong type for argument 3: expected function');
        expect(wrap(clip1, args4)).to.throw(TypeError, 'Wrong type for argument 3: expected function');
        expect(wrap(clip1, args5)).to.throw(TypeError, 'Wrong type for argument 3: expected function');
    });

    it('should be able to change the subject fill type', function() {
        expect(clip1.setFillTypes(types.EVENODD)).to.be.undefined;
        expect(clip1.setFillTypes(types.NONZERO)).to.be.undefined;
        expect(clip1.setFillTypes(types.POSITIVE)).to.be.undefined;
        expect(clip1.setFillTypes(types.NEGATIVE)).to.be.undefined;
    });

    it('should be able to change both the subject fill type and clip fill type', function() {
        expect(clip1.setFillTypes(types.EVENODD, types.EVENODD)).to.be.undefined;
        expect(clip1.setFillTypes(types.NONZERO, types.NONZERO)).to.be.undefined;
        expect(clip1.setFillTypes(types.POSITIVE, types.POSITIVE)).to.be.undefined;
        expect(clip1.setFillTypes(types.NEGATIVE, types.NEGATIVE)).to.be.undefined;
    });

    it('should be able to use callback to change the subject fill type', function(done) {
        clip1.setFillTypes(types.EVENODD, function(err, result) {
            expect(err).to.be.false;
            expect(result).to.be.undefined;
            done();
        });
    });

    it('should be able to use callback to change both the subject and clip fill types', function(done) {
        clip1.setFillTypes(types.NONZERO, types.NONZERO, function(err, result) {
            expect(err).to.be.false;
            expect(result).to.be.undefined;
            done();
        });
    });

    it('should show errors in the callback', function(done) {
        clip1.setFillTypes(function(err, result) {
            expect(err).to.eql(new TypeError('Wrong type for argument 1: expected number'));
            done();
        });
    });

    it('should be able to use promises to set the subject fill type', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return clip.setFillTypesAsync(types.POSITIVE).then(function(value) {
                expect(value).to.be.undefined;
            });
        });
    });

    it('should be able to use promises to set both subject and clip fill types', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return clip.setFillTypesAsync(types.NEGATIVE).then(function(value) {
                expect(value).to.be.undefined;
            });
        });
    });

    it('should be able to catch error with promises', function() {
        return clipper.beginAsync().then(Promise.promisifyAll).then(function(clip) {
            return clip.setFillTypesAsync();
        }).catch(function(e) {
            expect(e).to.eql(new TypeError('Wrong type for argument 1: expected number'));
        });
    });
});