// Simple utility methods for working with the DOM
DOM = {};

// DOMBuilder for prototype
DOM.Builder = {
	tagFunc : function(tag) {
    return function() {
     var attrs, children;
     if (arguments.length>0) {
       if (arguments[0].constructor == Object) {
         attrs = arguments[0];
         children = Array.prototype.slice.call(arguments, 1);
       } else {
         children = arguments;
       };
       children = $A(children).flatten()
     }
     return DOM.Builder.create(tag, attrs, children);
    };
  },
	create : function(tag, attrs, children) {
		attrs = attrs || {}; children = children || []; tag = tag.toLowerCase();
		var el = new Element(tag, attrs);
	  
		for (var i=0; i<children.length; i++) {
			if (typeof children[i] == 'string') 
			  children[i] = document.createTextNode(children[i]);
			el.appendChild(children[i]);
		}
		return $(el);
	}
};

// Automatically create node builders as $tagName.
(function() { 
	var els = ("p|div|span|strong|em|img|table|tr|td|th|thead|tbody|tfoot|pre|code|" + 
				     "h1|h2|h3|h4|h5|h6|ul|ol|li|form|input|textarea|legend|fieldset|" + 
				     "select|option|blockquote|cite|br|hr|dd|dl|dt|address|a|button|abbr|acronym|" +
				     "script|link|style|bdo|ins|del|object|param|col|colgroup|optgroup|caption|" + 
				     "label|dfn|kbd|samp|var").split("|");
  var el, i=0;
	while (el = els[i++]) 
	  window['$' + el] = DOM.Builder.tagFunc(el);
})();

DOM.Builder.fromHTML = function(html) {
  var root;
  if (!(root = arguments.callee._root))
    root = arguments.callee._root = document.createElement('div');
  root.innerHTML = html;
  return root.childNodes[0];
};

