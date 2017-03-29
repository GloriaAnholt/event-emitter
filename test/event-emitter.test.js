const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('event emitter class', () => {

    // create a global event emitter to use between tests
    let ee = new EventEmitter();

    // define a callback to register with events
    const callback = () => {};

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
        const othercb = () => {};
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

    it('removes all listeners for a given event type', () => {
        ee.addListener('REMOVEME', callback);
        ee.addListener('REMOVEME', callback);
        ee.addListener('REMOVEME', callback);
        assert.equal(ee.events['REMOVEME'].length, 3);
        
        let returnedEE = ee.removeAllListeners('REMOVEME');
        assert.equal(ee.events['REMOVEME'].length, 0);
        // removeAll returns a ref to the EE class itself
        assert.deepEqual(EventEmitter, returnedEE);
    });

    it('removes the first correct listener on remove', () => {
        const localcb = () => { 'different function' };

        ee.addListener('removeOne', localcb);
        ee.addListener('removeOne', callback);
        ee.addListener('removeOne', localcb);
        assert.equal(ee.events['removeOne'].length, 3);
        
        ee.removeListener('removeOne', localcb);
        assert.equal(ee.events['removeOne'].length, 2);
        
        // the first local should be removed, leaving the other two
        assert.deepEqual(ee.events['removeOne'], [callback, localcb]);
    });

    it('calls the handlers on emit, passing in args', () => {
        let A = '', B = '', C = '', D = '', E = '';
        const handlerABC = (a, b, c) => {
            // capture the values of the args I was called with
            A = a, B = b, C = c;
        };
        const handlerDE = (d, e) => {
            D = d, E = e;
        };

        ee.addListener('useArgs', handlerABC);
        ee.addListener('useArgs', handlerDE);
        ee.emit('useArgs', 'apple', 'banana', 'cantaloupe', 'dates');
        
        assert.strictEqual(A, 'apple');
        assert.strictEqual(B, 'banana');
        assert.strictEqual(C, 'cantaloupe');
        assert.strictEqual(D, 'apple');
        assert.strictEqual(E, 'banana');
    })

});