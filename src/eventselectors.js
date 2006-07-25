// Event.addBehavior by Dan Webb based on event:Selectors by Justin Palmer
Event.addBehavior = function(rules) {
  var selectors = this.addBehavior;
  Object.extend(selectors.rules, rules);
  
  if (selectors.autoTrigger) {
    var init = selectors.load.bind(selectors);
    if (this.onDOMReady) this.onDOMReady(init);
    else this.observe(window, 'load', init);
  }
  
  if (selectors.reassignAfterAjax) Ajax.Responders.register({
    onComplete : function() { Event.selectors.load(); }
  });
  
  selectors.autoTrigger = selectors.reassignAfterAjax = false;
}

Object.extend(Event.addBehavior, {
  rules : {}, cache : [],
  reassignAfterAjax : true,
  autoTrigger : true,
  
  load : function() {
    this.unload();
    for (var selector in this.rules) {
      var observer = this.rules[selector];
      var sels = selector.split(',');
      sels.each(function(sel) {
        var parts = sel.split(':'), css = parts[0], event = parts[1];
        $$(css).each(function(element) {
          var oel = observer.bindAsEventListener(element);
          element.observe(event, oel);
          Event.addBehavior.cache.push([element, event, oel]);
        })
      });
    }
  },
  
  unload : function() {
    this.cache.each(function(c) {
      Event.stopObserving.apply(Event, c);
    })
  }
  
});

Event.observe(window, 'unload', Event.addBehavior.unload.bind(Event.addBehavior));