const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('EventEmitter class: ', () => {

    // create a global event emitter to use between tests
    let ee = new EventEmitter();

    // create a globalHandler to use between test 
    const globalHandler = () => {};

    it('creates and returns an EventEmitter object', () => {
        assert.isObject(ee);
    }); 

    it('returns the unsubscribe function when you add a listener', () => {
        let removeMe = ee.addListener('RemoveMe', globalHandler);
        assert.isFunction(removeMe);
    });

    it('calls the registered handler for an eventName', () => {
        let counter = 0;
        const handler = () => { ++counter };
        ee.addListener('increment', handler);
        ee.emit('increment');
        assert.equal(counter, 1);
        ee.emit('increment');
        assert.equal(counter, 2);
    });

    it('does not emit events for different types', () => {
        let counterA = 0, counterB = 0;
        const handlerA = () => { ++counterA };
        const handlerB = () => { ++counterB };

        ee.addListener('typeA', handlerA);
        ee.addListener('typeB', handlerB);

        ee.emit('typeA');
        assert.equal(counterA, 1);
        assert.equal(counterB, 0);

        ee.emit('typeB');
        assert.equal(counterA, 1);
        assert.equal(counterB, 1);
    });


    it('removes a registered handler when you call the returned remove function', () => {
        let counterKeep = 0, counterRemove = 0;
        const keepHandler = () => { ++counterKeep };
        const removeHandler = () => { ++counterRemove };
        
        ee.addListener('bacon', keepHandler);
        // capture the unsubscribe function to use later
        let unsubscribe = ee.addListener('bacon', removeHandler);
        assert.isFunction(unsubscribe);

        ee.emit('bacon');
        assert.equal(counterKeep, 1);
        assert.equal(counterRemove, 1);

        // remove one listener, not the other
        unsubscribe();

        ee.emit('bacon');
        assert.equal(counterKeep, 2);       // should increment
        assert.equal(counterRemove, 1);     // shouldn't increment
    });

    it('removes a registered handler using the removeListener method', () => {
        let counterKeep = 0, counterRemove = 0;
        const keepHandler = () => { ++counterKeep };
        const removeHandler = () => { ++counterRemove };
        
        ee.addListener('eggs', keepHandler);
        ee.addListener('eggs', removeHandler);

        ee.emit('eggs');
        assert.equal(counterKeep, 1);
        assert.equal(counterRemove, 1);

        // remove one listener, not the other
        ee.removeListener('eggs', removeHandler);

        ee.emit('eggs');
        assert.equal(counterKeep, 2);       // should increment
        assert.equal(counterRemove, 1);     // shouldn't increment
    });

    it('removes all listeners for a given event type', () => {
        let counter1 = 0, counter2 = 0;
        const handlerA = () => { ++counter1 };
        const handlerB = () => { ++counter2 };
        
        ee.addListener('toast', handlerA);
        ee.addListener('toast', handlerB);

        ee.emit('toast');
        assert.equal(counter1, 1);
        assert.equal(counter2, 1);

        // remove all listeners
        ee.removeAllListeners('toast');

        ee.emit('toast');
        // neither should increment
        assert.equal(counter1, 1);     
        assert.equal(counter2, 1);     
    });

    it('removes the first correct listener on removeListener', () => {
        let counter = 0, duplicateCounter = 0;
        const handler = () => { ++counter };
        const handlerDuplicate = () => { ++duplicateCounter };

        ee.addListener('removeOne', handler);
        ee.addListener('removeOne', handlerDuplicate);
        ee.addListener('removeOne', handlerDuplicate);

        ee.emit('removeOne')
        // we should expect the duplicated handler function to have been called twice
        assert.equal(counter, 1);
        assert.equal(duplicateCounter, 2);
        
        ee.removeListener('removeOne', handlerDuplicate);

        ee.emit('removeOne')
        // we should expect the duplicated handler to have been called only once this time
        assert.equal(counter, 2);
        assert.equal(duplicateCounter, 3);
        
    });

    it('calls the handlers on emit, passing in variable number of args', () => {
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

    it('removes a once handler after it is called once', () => {
        let countOnce = 0, counter = 0;
        const onceHandler = () => { ++countOnce };
        const manyHandler = () => { ++counter };
        
        ee.addListener('justOnce', manyHandler);
        ee.once('justOnce', onceHandler);  

        ee.emit('justOnce');
        assert.equal(countOnce, 1);
        assert.equal(counter, 1);

        // Second emit event, onceHandler should be unsubscribed so 
        // countOnce shouldn't change
        ee.emit('justOnce');
        assert.equal(countOnce, 1);
        assert.equal(counter, 2)
    });

});