const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('event emitter class', () => {

    it('creates an empty state object', () => {
        let ee = new EventEmitter();
        assert.deepEqual(ee.events, {});
    }); 

});