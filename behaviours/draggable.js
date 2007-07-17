Draggable = Behavior.create({
  initialize : function(options) {
    this.options = Object.extend({
      onStart : Prototype.K,
      onComplete : Prototype.K,
      units : 'px',
      zindex : 1000,
      revert : true
    }, options || {});
    
    this.handle = this.options.handle || this.element;
    Draggable.Handle.attach(this.handle, this);
    
    this.element.makePositioned();
      
    this.startX = this.element.getStyle('left') || '0px';
    this.startY = this.element.getStyle('top') || '0px';
    this.startZ = this.element.getStyle('z-index');
      
    Draggable.draggables.push(this);  
  },
  move : function(x, y) {
    this.element.setStyle({
      left : (parseInt(this.element.getStyle('left')) || 0) + x + this.options.units,
      top : (parseInt(this.element.getStyle('top')) || 0) + y + this.options.units
    });
  },
  drag : function(e) {
    this.clientX = e.clientX;
		this.clientY = e.clientY;
		this.move(this.clientX - this.lastMouseX, this.clientY - this.lastMouseY)
    this.set(e);
		return false;
  },
  set :function(e) {
    this.lastMouseX = e.clientX;
		this.lastMouseY = e.clientY;
  },
  stop : function() {
    this.unbindDocumentEvents();
    
    Draggable.targets.each(function(target) {
      if (Position.within(target.element, this.clientX, this.clientY)) {
        target.onDrop(this);
      }
    }.bind(this));
    
    this.options.onComplete(this);
    
    if (this.options.revert) {
      if (typeof this.options.revert == 'function') {
        this.options.revert(this);
      } else this.element.setStyle({
        left : this.startX,
         top : this.startY
      });
    }
    
    this.element.style.zIndex = this.startZ;
  },
  bindDocumentEvents : function() {
    document.onmousemove = this.drag.bindAsEventListener(this);
    document.onmouseup = this.stop.bindAsEventListener(this);
  },
  unbindDocumentEvents : function() {
    document.onmousemove = document.onmouseup = null;
  }
});

Draggable.Handle = Behavior.create({
  initialize : function(draggable) {
    this.draggable = draggable;
  },
  onmousedown : function(e) {
		this.draggable.bindDocumentEvents();
		this.draggable.set(e);
		this.draggable.element.style.zIndex = this.draggable.options.zindex;
		this.draggable.options.onStart(this.draggable);
		return false;
  }
});

Draggable.draggables = [];
Draggable.targets = [];

Draggable.DropTarget = Behavior.create({
  initialize : function(options) {
    this.options = Object.extend({
      onDrop : Prototype.K
    }, options || {});
    
    Draggable.targets.push(this);
  },
  onDrop : function(draggable) {
    if (this.canDrop(draggable))
      return this.options.onDrop.call(this, draggable);
    else return false;
  },
  canDrop : function(draggable) {
    return !this.options.accepts || draggable.element.hasClassName(this.options.accepts);
  }
});