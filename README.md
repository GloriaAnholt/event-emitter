# Global





* * *

## Class: EventEmitter



## Class: EventEmitter



## Class: EventEmitter


### EventEmitter.addListener(eventName, cb) 

Adds a new listener for the event based on the string token eventName, or creates the event 
type if not in dict of events. Throws a TypeError if not passed a callback function.

**Parameters**

**eventName**: `string`, A string token for event type, by name

**cb**: `function`, The callback function to invoke when a matching event is emitted


### EventEmitter.once(eventName, cb) 

Adds a one-time-use listener for the eventName, removed from listeners after first matching event
is emitted. Cannot be removed by removeListener - must use the returned unsubscribe function.
Throws a TypeError if not passed a function as a handler.

**Parameters**

**eventName**: `string`, A string token for event type, by name

**cb**: `function`, The callback function to invoke once when a matching event is emitted


### EventEmitter.emit(eventName, args) 

When an event is emitted matching a registered event type, invokes each listener's callback function
in the order they were registered, passing along whatever arguments the emit method recieved. 
Throws a ReferenceError if the event name has never been registered - passes silently if no handlers 
are currently registered for a given event name.

**Parameters**

**eventName**: `string`, A string token for event type, by name

**args**: `*`, Takes any number of any type of arguments and passes them to the callback functions


### EventEmitter.removeListener(eventName, cb) 

Removes the first matching listener for the event based on the string token eventName.
Returns true if a matching callback is found, throws a ReferenceError if no events are 
registered by the event name or no matching listeners are found.

**Parameters**

**eventName**: `string`, A string token for event type, by name

**cb**: `function`, The callback function to remove from the registered listeners


### EventEmitter.removeAllListeners(eventName) 

Removes all matching listeners for the event based on the string token eventName. Returns the 
EventEmitter if a matching event name is found, throws a ReferenceError if no events are 
registered by the event name. 
Note: does not remove the event type key from the dict, simply clears all listeners.

**Parameters**

**eventName**: `string`, A string token for event type, by name, to remove all events.




* * *










