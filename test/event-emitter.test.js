const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('event emitter class', () => {

    it('creates an empty state object', () => {
        let ee = new EventEmitter();
        assert.deepEqual(ee.events, {});
    }); 

    it('adds a new event type to the hash, registers handler fn', () => {
        let ee = new EventEmitter();
        let callback = function() {}
        ee.addListener('TEST', callback);
        assert.isOk(ee.events['TEST'])
        assert.deepEqual(ee.events['TEST'], [callback]);
    })

});