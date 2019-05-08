const chai = require('chai');

global.Test = {};
global.Test.assertSimilar = chai.assert.deepEqual;
