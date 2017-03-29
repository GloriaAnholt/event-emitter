// A JS class for Pub/Sub event emitting

class EventEmitter {
    constructor() {
        this._events = {};
    }

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
    
    emit(eventName, ...args) {
        if ( this._events[eventName] ) {
            this._events[eventName].map(fn => {
                fn.call(this, ...args);
            })
        }
        // error: eventName wasn't registered
        else return false
    }

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