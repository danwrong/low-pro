Draggable = Behavior.create({
  initialize : function(options) {
    this.options = Object.extend({
      // defaults
    }, options);
    Draggable.draggables.push(this);
  },
  
  onmousedown : function() {
    
  },
  
  onmouseover : function() {
    
  },
  
  onmousemove : function() {
    
  }
});

Object.extend(Draggable, {
  draggables : []
});