// Based on event:Selectors by Justin Palmer
// http://encytemedia.com/event-selectors/
//
// Usage:
//
// Event.addBehavior({
//      "selector:event" : function(event) { /* event handler.  this refers to the element. */ },
//      "selector" : function() { /* runs function on dom ready.  this refers to the element. */ }
//      ...
// });
//
// Multiple calls will add to exisiting rules.  Event.addBehavior.reassignAfterAjax and
// Event.addBehavior.autoTrigger can be adjusted to needs.
Event.addBehavior = function(rules) {
  var ab = this.addBehavior;
  Object.extend(ab.rules, rules);
  
  if (!ab.responderApplied) {
    Ajax.Responders.register({
      onComplete : function() { 
        if (Event.addBehavior.reassignAfterAjax) 
          setTimeout(function() { ab.unload(); ab.load(ab.rules) }, 10);
      }
    });
    ab.responderApplied = true;
  }
  
  if (ab.autoTrigger) {
    this.onReady(ab.load.bind(ab, rules));
  }
  
};

Object.extend(Event.addBehavior, {
  rules : {}, cache : [],
  reassignAfterAjax : true,
  autoTrigger : true,
  
  load : function(rules) {
    for (var selector in rules) {
      var observer = rules[selector];
      var sels = selector.split(',');
      sels.each(function(sel) {
        var parts = sel.split(/:(?=[a-z]+$)/), css = parts[0], event = parts[1];
        $$(css).each(function(element) {
          if (event) {
            $(element).observe(event, observer);
            Event.addBehavior.cache.push([element, event, observer]);
          } else {
            if (!element.$$assigned || !element.$$assigned.include(observer)) {
              if (observer.attach) observer.attach(element);
              
              else observer.call($(element));
              element.$$assigned = element.$$assigned || [];
              element.$$assigned.push(observer);
            }
          }
        });
      });
    }
  },
  
  unload : function() {
    this.cache.each(function(c) {
      Event.stopObserving.apply(Event, c);
    });
    this.cache = [];
  }
  
});

Event.observe(window, 'unload', Event.addBehavior.unload.bind(Event.addBehavior));

// Behaviors can be bound to elements to provide an object orientated way of controlling elements
// and their behavior.  Use Behavior.create() to make a new behavior class then use attach() to
// glue it to an element.  Each element then gets it's own instance of the behavior and any
// methods called onxxx are bound to the relevent event.
// 
// Usage:
// 
// var MyBehavior = Behavior.create({
//   onmouseover : function() { this.element.addClassName('bong') } 
// });
//
// Event.addBehavior({ 'a.rollover' : MyBehavior });
// 
// If you need to pass additional values to initialize use:
//
// Event.addBehavior({ 'a.rollover' : MyBehavior(10, { thing : 15 }) })
//
// You can also use the attach() method.  If you specify extra arguments to attach they get passed to initialize.
//
// MyBehavior.attach(el, values, to, init);
//
Behavior = {
  create : function(members) {
    var behavior = function() { 
      var behavior = arguments.callee;
      if (this == window) {
        var args = [];
        for (var i = 0; i < arguments.length; i++) 
          args.push(arguments[i]);
          
        return function(element) {
          var initArgs = [this].concat(args);
          behavior.attach.apply(behavior, initArgs);
        };
      } else {
        var args = (arguments.length == 2 && arguments[1] instanceof Array) ? 
                      arguments[1] : Array.prototype.slice.call(arguments, 1);

        this.element = $(arguments[0]);
        this.initialize.apply(this, args);
        behavior._bindEvents(this);
        behavior.instances.push(this);
      }
    };
    behavior.prototype.initialize = Prototype.K;
    Object.extend(behavior.prototype, members);
    Object.extend(behavior, Behavior.ClassMethods);
    behavior.instances = [];
    return behavior;
  },
  ClassMethods : {
    attach : function(element) {
      return new this(element, Array.prototype.slice.call(arguments, 1));
    },
    _bindEvents : function(bound) {
      for (var member in bound)
        if (member.match(/^on(.+)/) && typeof bound[member] == 'function')
          bound.element.observe(RegExp.$1, bound[member].bindAsEventListener(bound));
    }
  }
};
