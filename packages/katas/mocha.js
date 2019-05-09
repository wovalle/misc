const chai = require('chai');

global.Test = {};
global.Test.assertSimilar = chai.assert.deepEqual;
global.Test.assertEquals = chai.assert.equal;
global.Test.expect = chai.expect;
