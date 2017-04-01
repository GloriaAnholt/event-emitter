// Gloria Anholt, Gloria.Anholt@gmail.com
// https://www.github.com/GloriaAnholt/event-emitter


/**
 * @class EventEmitter
 * @classdesc 
 * A simple factory which returns a Pub/Sub style Event Emitter in ES6. 
 * Subscription is managed via the addListener (reusable events) or the once methods to add a new listener 
 * to a given event name. Individual handlers are removed via the returned unsubscribe function, or by 
 * using the removeListener method (both remove the first matching handler function for that event type). 
 * Handlers registered by the "once" method can only be removed using their returned unsubscribe function. 
 * The removeAllListeners method clears all registered listeners for the given event name, but does not 
 * remove the event name from the registered events. 
 * Events are emitted using the emit method, and the handlers are called in the order they were registered 
 * for a given event name, minus any listeners that were removed before an emit event occurred. 
 * Emitting an event for an emptied event name does not throw an error.
 */
class EventEmitter {
    /** 
     * @constructor
     */
    constructor() {
        this._events = {};
    }

    /**
     * Adds a new listener for the event based on the string token eventName, or creates the event 
     * type if not in dict of events. Throws a TypeError if not passed a callback function.
     * @method
     * @param {string} eventName - A string token for event type, by name 
     * @param {function} cb - The callback function to invoke when a matching event is emitted
     */
    addListener(eventName, cb) {
        if ( !this._events[eventName] ) {
            this._events[eventName] = [];
        }
        if ( typeof cb === 'function' ) {
            this._events[eventName].push(cb);
            // return them their unsubscribe function
            return () => { 
                this.removeListener(eventName, cb);
            }
        } 
        else throw new TypeError('Error: addlistener(eventName, cb) - callbacks must be of type function');
    }

    /**
     * Adds a one-time-use listener for the eventName, removed from listeners after first matching event
     * is emitted. Cannot be removed by removeListener - must use the returned unsubscribe function.
     * Throws a TypeError if not passed a function as a handler.
     * @method
     * @param {string} eventName - A string token for event type, by name 
     * @param {function} cb - The callback function to invoke once when a matching event is emitted
     */
    once(eventName, cb) {
        if ( typeof cb === 'function' ) {
            const wrapper = (...args) => {
                this.removeListener(eventName, wrapper);
                cb.call(this, ...args);
            }
            this.addListener(eventName, wrapper);
        }
        else throw new TypeError('Error: addlistener(eventName, cb) - callbacks must be of type function');
    }
    
    /**
     * When an event is emitted matching a registered event type, invokes each listener's callback function
     * in the order they were registered, passing along whatever arguments the emit method recieved. 
     * Throws a ReferenceError if the event name has never been registered - passes silently if no handlers 
     * are currently registered for a given event name.
     * @method
     * @param {string} eventName - A string token for event type, by name 
     * @param {*} args - Takes any number of any type of arguments and passes them to the callback functions
     */
    emit(eventName, ...args) {
        if ( this._events[eventName] ) {
            this._events[eventName].map(fn => {
                fn.call(this, ...args);
            })
        }
        else throw new ReferenceError('Error: eventName not found');
    }

    /**
     * Removes the first matching listener for the event based on the string token eventName.
     * Returns true if a matching callback is found, throws a ReferenceError if no events are 
     * registered by the event name or no matching listeners are found.
     * @method
     * @param {string} eventName - A string token for event type, by name 
     * @param {function} cb - The callback function to remove from the registered listeners
     */
    removeListener(eventName, cb) {
        if ( this._events[eventName] ) {
            let index = this._events[eventName].indexOf(cb);
            if (index > -1) {
                this._events[eventName].splice(index, 1);
                return true;
            } 
            else throw new ReferenceError('Error: cb not registered for eventName');
        }
        else throw new ReferenceError('Error: eventName not found');
    }

    /**
     * Removes all matching listeners for the event based on the string token eventName. Returns the 
     * EventEmitter if a matching event name is found, throws a ReferenceError if no events are 
     * registered by the event name. 
     * Note: does not remove the event type key from the dict, simply clears all listeners.
     * @method
     * @param {string} eventName - A string token for event type, by name, to remove all events.
     */
    removeAllListeners(eventName) {
        if ( this._events[eventName] ) {
            this._events[eventName].length = 0;
            // Like node, returns a reference to itself to allow for chaining calls
            return EventEmitter;
        }
        else throw new ReferenceError('Error: eventName not found');
    }
    
}

module.exports = EventEmitter;