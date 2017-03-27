const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('event emitter class', () => {

    // create a global event emitter to use between tests
    let ee = new EventEmitter();

    // define a callback to register with events
    let callback = function() {};

    it('creates an empty state object', () => {
        assert.deepEqual(ee.events, {});
    }); 

    it('adds a new event type to the hash, registers handler fn', () => {
        ee.addListener('TEST', callback);
        assert.isOk(ee.events['TEST'])
        assert.deepEqual(ee.events['TEST'], [callback]);
    });

    it('returns false if you try to register a non-function', () => {
        let response = ee.addListener('FAIL', 'string');
        assert.isOk(ee.events['FAIL'])
        assert.isFalse(response);
    });

    it('returns the function to unsubscribe', () => {
        let othercb = function() {};
        // make sure there's only one cb in the TEST event array
        assert.equal(ee.events['TEST'].length, 1);
        // add a new listener and capture it's unsubscribe function
        const removeMe = ee.addListener('TEST', othercb);
        // make sure the cb is in the array 
        assert.equal(ee.events['TEST'].length, 2);
        removeMe();
        // make sure this cb isn't in there anymore
        assert.equal(ee.events['TEST'].length, 1);
        assert.notInclude(ee.events['TEST'], othercb);
    });

});