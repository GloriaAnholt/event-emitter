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
    
}

module.exports = EventEmitter;