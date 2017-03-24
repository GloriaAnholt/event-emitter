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

});