Element.addMethods({
  nextElement : function(element) {
    element = $(element);
    while (element = element.nextSibling) 
      if (element.nodeType == 1) return $(element);
    return null;
  },
  previousElement : function(element) {
    element = $(element);
    while (element = element.previousSibling) 
      if (element.nodeType == 1) return $(element);
    return null;
  },
  remove : function(element) {
    return $(element).parentNode.removeChild(element);
  }
});

DOM = {
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
	    var arguments, attrs, children; 
	    if (arguments.length>0) { 
	      if (arguments[0].nodeName || typeof arguments[0] == "string") children = arguments; 
	      else { attrs = arguments[0]; children = Array.slice(arguments, 1); }
	    }
	    return DOM.create(tag, attrs, children);
	  }
  },
	create : function(tag, attrs, children) {
		attrs = attrs || {}; children = children || [];
		var isIE = navigator.userAgent.match(/MSIE/)
		var el = document.createElement((isIE && attrs.name) ? "<" + tag + " name=" + attrs.name + ">" : tag);
		for (var attr in attrs) {
		  if (typeof attrs[attr] != 'function') {
		    if (isIE) this.ieAttrSet(attrs, attrs, el);
		    else el.setAttribute(attr, attrs[attr]);
		  }
	  }
		for (var i=0; i<children.length; i++) {
			if (typeof children[i] == 'string') children[i] = document.createTextNode(children[i]);
			el.appendChild(children[i]);
		} 
		return $(el);
	}
};

(function() { 
	var els = ("p|div|span|strong|em|img|table|tr|td|th|thead|tbody|tfoot|pre|code|" + 
				   "h1|h2|h3|h4|h5|h6|ul|ol|li|form|input|textarea|legend|fieldset|" + 
				   "select|option|blockquote|cite|br|hr|dd|dl|dt|address|a|button|abbr|acronym|" +
				   "script|link|style|bdo|ins|del|object|param|col|colgroup|optgroup|caption|" + 
				   "label|dfn|kbd|samp|var").split("|");
  var el, i=0;
	while (el = els[i++]) window['$' + el] = DOM.tagFunc(el);
})();

