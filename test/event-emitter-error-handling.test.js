const assert = require('chai').assert;
const EventEmitter = require('../event-emitter');

describe('EventEmitter class error handling: ', () => {

    // create a global event emitter to use between tests
    let ee = new EventEmitter();

    // create a globalHandler to use between test 
    const globalHandler = () => {}; 

    it('throws a TypeError if you try to register a non-function using addListener', () => {
        let cb = () => { return ee.addListener('FAIL', 'string'); };
        assert.throws(
            cb, 
            TypeError, 
            'Error: addlistener(eventName, cb) - callbacks must be of type function'
        );
    });

    it('throws a TypeError if you try to register a non-function using once', () => {
        let cb = () => { return ee.once('FAIL', 'string'); };
        assert.throws(
            cb, 
            TypeError, 
            'Error: addlistener(eventName, cb) - callbacks must be of type function'
        );
    });

    it('throws a ReferenceError if you try to emit an unregistered event', () => {
        let cb = () => { return ee.emit('I don\'t exist!'); };
        assert.throws(
            cb, 
            ReferenceError, 
            'Error: eventName not found'
        );
    });

    it('throws a ReferenceError if you try to remove an unregistered method', () => {
        const registeredHandler = () => {};
        const unregisteredHandler = () => {};
        
        ee.addListener('coffee', registeredHandler);

        const fails = () => { ee.removeListener('coffee', unregisteredHandler); };
        
        assert.throws(
            fails, 
            ReferenceError, 
            'Error: cb not registered for eventName'
        );
    });

    it('throws a ReferenceError if you try to remove an unregistered event name', () => {
        const registeredHandler = () => {};
        
        ee.addListener('tea', registeredHandler);

        const fails = () => { ee.removeListener('notTea', registeredHandler); };
        
        assert.throws(
            fails, 
            ReferenceError, 
            'Error: eventName not found'
        );
    });

    it('throws a ReferenceError if you try to removeAllListeners from an unregistered event name', () => {
        const registeredHandler = () => {};
        
        ee.addListener('orangeJuice', registeredHandler);

        const fails = () => { ee.removeAllListeners('notJuice', registeredHandler); };
        
        assert.throws(
            fails, 
            ReferenceError, 
            'Error: eventName not found'
        );
    });

});