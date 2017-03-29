// A JS class for Pub/Sub event emitting

/*
Create an Event Emitter module in JavaScript (as modern of a version 
as you prefer) with documentation and tests. Your implementation should

allow for:
  * Emitting named events with any number of arguments.
    
  * Registering handler functions for named events that are 
      passed the appropriate arguments on emission.

  * Registering a "one-time" handler that will be called at most one time.

  * Removing specific previously-registered event handlers and/or all 
    previously-registered event handlers.

This module should be suitable for publishing to npm, though it is not 
necessary for you to do so.
*/


class EventEmitter {
    constructor() {
        this.events = {};
    }

    addListener(eventName, cb) {
        if ( !this.events[eventName] ) {
            this.events[eventName] = [];
        }
        if ( typeof cb === 'function' ) {
            this.events[eventName].push(cb);

            // return them their unsubscribe function
            return () => { 
                this.events[eventName] = this.events[eventName].filter(fn => {
                if (fn !== cb) return fn
                })
            }
        } 
        // error: didn't pass a fn as a handler, add failed
        else return false;
    }

    removeListener(eventName, cb) {
        if ( this.events[eventName] ) {
            let index = this.events[eventName].indexOf(cb);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
                return true;
            }
        }
        // error: couldn't find event or registered handler
        else return false;
    }

    removeAllListeners(eventName) {
        if ( this.events[eventName] ) {
            this.events[eventName].length = 0;
            // Like node, returns a reference to itself to allow for chaining calls
            return EventEmitter;
        }
        // error: eventName wasn't registered
        else return false
    }

    emit(eventName, ...args) {
        if ( this.events[eventName] ) {
            this.events[eventName].map(fn => {
                fn(...args);
            })
        }
        // error: eventName wasn't registered
        else return false
    }
    
}

module.exports = EventEmitter;