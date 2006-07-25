// Extend Element with observe and stopObserving.
Element.addMethods({
  
  observe : function(el, event, callback) {
    Event.observe.call(Event, el, event, callback);
  },
  
  stopObserving : function(el, event, callback) {
    Event.stopObserving.call(Event, el, event, callback);
  }
  
});

// Allows you to trigger an event element.  
Object.extend(Event, {
  trigger : function(element, event, fakeEvent) {
    element = $(element);
    fakeEvent = fakeEvent || { type :  event };
    this.observers.each(function(cache) {
      if (cache[0] == element && cache[1] == event)
        cache[2].call(element, fakeEvent);
    });
  }
});