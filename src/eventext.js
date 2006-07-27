if (!Element.addMethods) Element.addMethods = function(o) { Object.extend(Element.Methods, o) };

// Extend Element with observe and stopObserving.
Element.addMethods({
  observe : function(el, event, callback) {
    Event.observe.call(Event, el, event, callback);
  },
  stopObserving : function(el, event, callback) {
    Event.stopObserving.call(Event, el, event, callback);
  }
});

// Make sure this always refers to the element in all browsers.
Event._oldObserveAndCache = Event._observeAndCache;
Event._observeAndCache = function(element, name, observer, useCapture) {
  observer = observer.bindAsEventListener(element);
  Event._oldObserveAndCache(element, name, observer, useCapture);
};

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