// A JS class for Pub/Sub event emitting

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
        // error - didn't pass a fn as a cb, add failed
        else return false;
    }

    removeAllListeners(eventName) {
        if ( this.events[eventName] ) {
            this.events[eventName].length = 0;
            // Like node, returns a reference to itself to allow for chaining calls
            return EventEmitter;
        }
        // eventName wasn't registered
        else return false
    }
    
}

module.exports = EventEmitter;