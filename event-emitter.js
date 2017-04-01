// Gloria Anholt, Gloria.Anholt@gmail.com
// https://www.github.com/GloriaAnholt/event-emitter


/**
 * @class EventEmitter
 * @classdesc 
 * A simple factory which returns a Pub/Sub style Event Emitter in ES6. 
 * Subscription is managed via an addListener (reusable) or once method to add a new listener to a 
 * given event name, and removed via either the returned unsubscribe method (from addListener), or 
 * using the removeListener (removes first match to callback) or removeAllListeners for a given event.
 * Events are emitted using the emit method.
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
     * type if not in dict of events. Returns false if not passed a callback function.
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
                this._events[eventName] = this._events[eventName].filter(fn => {
                if (fn !== cb) return fn
                })
            }
        } 
        // error: didn't pass a fn as a handler, add failed
        else return false;
    }

    /**
     * Adds a one-time use listener for the eventName, removed from listeners after first matching event
     * id emitted
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
        // error: didn't pass a fn as a handler, add failed
        else return false;
    }
    
    /**
     * When an event is emitted matching a registered event type, invokes each listener's callback
     * function, passing along whatever arguments the emit method recieved. 
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
        // error: eventName wasn't registered
        else return false
    }

    /**
     * Removes the first matching listener for the event based on the string token eventName.
     * Returns true if a matching callback is found, false if no events are registered by the 
     * event name or no matching listeners are found.
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
        }
        // error: couldn't find event or registered handler
        else return false;
    }

    /**
     * Removes all matching listener for the event based on the string token eventName. Returns the 
     * EventEmitter if a matching event name is found, false if no events are registered by the event 
     * name. Note: does not remove the event type key from the dict, simply clears all listeners.
     * @method
     * @param {string} eventName - A string token for event type, by name, to remove all events.
     */
    removeAllListeners(eventName) {
        if ( this._events[eventName] ) {
            this._events[eventName].length = 0;
            // Like node, returns a reference to itself to allow for chaining calls
            return EventEmitter;
        }
        // error: eventName wasn't registered
        else return false
    }
    
}

module.exports = EventEmitter;