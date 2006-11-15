// Simple utility methods for working with the DOM
DOM = {
  nextElement : function(element) {
    element = $(element);
    while (element = element.nextSibling) 
      if (element.nodeType == 1) return element;
    return null;
  },
  previousElement : function(element) {
    element = $(element);
    while (element = element.previousSibling) 
      if (element.nodeType == 1) return element;
    return null;
  },
  remove : function(element) {
    element = $(element);
    return element.parentNode.removeChild(element);
  },
  insertAfter : function(element, node, otherNode) {
    element = $(element);
    return element.insertBefore(node, otherNode.nextSibling);
  },
  addBefore : function(element, node) {
    element = $(element);
    return element.parentNode.insertBefore(node, element);
  },
  addAfter : function(element, node) {
    element = $(element);
    return $(element.parentNode).insertAfter(node, element);
  },
  replaceElement : function(element, node) {
    $(element).parentNode.replaceChild(node, element);
    return node;
  }
};

// Add them to the element mixin
Element.addMethods(DOM);

// DOMBuilder for prototype
DOM.Builder = {
  IE_TRANSLATIONS : {
    'class' : 'className',
    'for' : 'htmlFor'
  },
  ieAttrSet : function(attrs, attr, el) {
    var trans;
    if (trans = this.IE_TRANSLATIONS[attr]) el[trans] = attrs[attr];
    else if (attr == 'style') el.style.cssText = attrs[attr];
    else if (attr.match(/^on/)) el[attr] = new Function(attrs[attr]);
    else el.setAttribute(attr, attrs[attr]);
  },
	tagFunc : function(tag) {
	  return function() {
	    var attrs, children; 
	    if (arguments.length>0) { 
	      if (arguments[0].nodeName || typeof arguments[0] == "string") children = arguments; 
	      else { attrs = arguments[0]; children = [].slice.call(arguments, 1); };
	    }
	    return DOM.Builder.create(tag, attrs, children);
	  };
  },
	create : function(tag, attrs, children) {
		attrs = attrs || {}; children = children || [];
		var isIE = navigator.userAgent.match(/MSIE/);
		var el = document.createElement((isIE && attrs.name) ? "<" + tag + " name=" + attrs.name + ">" : tag);
		for (var attr in attrs) {
		  if (typeof attrs[attr] != 'function') {
		    if (isIE) this.ieAttrSet(attrs, attr, el);
		    else el.setAttribute(attr, attrs[attr].toString());
		  };
	  }
		for (var i=0; i<children.length; i++) {
			if (typeof children[i] == 'string') children[i] = document.createTextNode(children[i]);
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
	while (el = els[i++]) window['$' + el] = DOM.Builder.tagFunc(el);
})();

