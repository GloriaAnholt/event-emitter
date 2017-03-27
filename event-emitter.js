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
        else return false;
    }
    
}

module.exports = EventEmitter;