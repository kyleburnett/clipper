// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Promise

var Promise = require('bluebird');

global.Promise = Promise;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Chai

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

global.expect = chai.expect;