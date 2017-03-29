const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('event emitter class', () => {

    // create a global event emitter to use between tests
    let ee = new EventEmitter();

    // define a globalHandler to register with events
    const globalHandler = () => {};

    it('creates an empty state object', () => {
        assert.deepEqual(ee.events, {});
    }); 

    it('adds a new event type to the hash, registers handler fn', () => {
        ee.addListener('TEST', globalHandler);
        assert.isOk(ee.events['TEST'])
        assert.deepEqual(ee.events['TEST'], [globalHandler]);
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
        ee.addListener('REMOVEME', globalHandler);
        ee.addListener('REMOVEME', globalHandler);
        ee.addListener('REMOVEME', globalHandler);
        assert.equal(ee.events['REMOVEME'].length, 3);
        
        let returnedEE = ee.removeAllListeners('REMOVEME');
        assert.equal(ee.events['REMOVEME'].length, 0);
        // removeAll returns a ref to the EE class itself
        assert.deepEqual(EventEmitter, returnedEE);
    });

    it('removes the first correct listener on remove', () => {
        const localcb = () => { 'different function' };

        ee.addListener('removeOne', localcb);
        ee.addListener('removeOne', globalHandler);
        ee.addListener('removeOne', localcb);
        assert.equal(ee.events['removeOne'].length, 3);
        
        ee.removeListener('removeOne', localcb);
        assert.equal(ee.events['removeOne'].length, 2);
        
        // the first local should be removed, leaving the other two
        assert.deepEqual(ee.events['removeOne'], [globalHandler, localcb]);
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
    });

    it('removes a once handler after it is called', () => {
        let count = 0;
        const localHandler = () => { count++ };
        
        // uses wrapper closure, cant check for localHandler inclusion
        ee.addListener('justOnce', globalHandler);
        ee.once('justOnce', localHandler);  
        assert.equal(ee.events['justOnce'].length, 2);

        // First emit event
        ee.emit('justOnce');
        assert.equal(count, 1);
        assert.equal(ee.events['justOnce'].length, 1);

        // Second emit event, count doesn't change
        ee.emit('justOnce');
        assert.equal(count, 1);
    })

});