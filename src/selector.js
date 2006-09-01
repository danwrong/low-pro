// Original code by Sylvian Zimmer
// http://www.sylvainzimmer.com/index.php/archives/2006/06/25/speeding-up-prototypes-selector/
// Optimises execution speed of the $$ function.  Rewritten for readability by Justin Palmer.
// 
// Turn off optimisation with LowPro.optimize$$ = false;
LowPro.SelectorLite = Class.create();
LowPro.SelectorLite.prototype = {
  initialize: function(selectors) {
    this.results = []; 
    this.selectors = []; 
    this.index = 0;
    
    for(var i = selectors.length -1; i >= 0; i--) {
      var params = { tag: '*', id: null, classes: [] };
      var selector = selectors[i];
      var needle = selector.length - 1;
      
      do {
        var id = selector.lastIndexOf("#");
        var klass = selector.lastIndexOf(".");
        var cursor = Math.max(id, klass);
        
        if(cursor == -1) params.tag = selector.toUpperCase();
        else if(id == -1 || klass == cursor) params.classes.push(selector.substring(klass + 1));
        else if(!params.id) params.id = selector.substring(id + 1);
        
        selector = selector.substring(0, cursor);
      } while(cursor > 0);
      
      this.selectors[i] = params;
    }
    
  },
  
  get: function(root) {
    this.findElements(root || document, this.index == (this.selectors.length - 1));
    return this.results;
  },
  
  findElements: function(parent, descendant) {
    var selector = this.selectors[this.index], results = [], element;
    if (selector.id) {
      element = $(selector.id);
      if (element && (selector.tag == '*' || element.tagName == selector.tag) && (element.childOf(parent))) {
          results = [element];
      }
    } else {
      results = $A(parent.getElementsByTagName(selector.tag));
    }
    
    if (selector.classes.length == 1) {
      results = results.select(function(target) {
       return $(target).hasClassName(selector.classes[0]);
      });
    } else if (selector.classes.length > 1) {
      results = results.select(function(target) {
        var klasses = $(target).classNames();
        return selector.classes.all(function(klass) {
          return klasses.include(klass);
        });
      });
    }
    
    if (descendant) {
      this.results = this.results.concat(results);
    } else {
      ++this.index;
      results.each(function(target) {
        this.findElements(target, this.index == (this.selectors.length - 1));
      }.bind(this));
    }
  }
};

LowPro.$$old=$$;
LowPro.optimize$$ = true;

$$ = function(a,b) {
  if (LowPro.optimize$$ == false || b || a.indexOf("[")>=0) 
    return LowPro.$$old(a, b);
  return new LowPro.SelectorLite(a.split(/\s+/)).get();
};