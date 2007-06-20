Form.Methods.serialize = function(form, getHash, buttonPressed) {
  var elements = Form.getElements(form).reject(function(element) {
    return ['submit', 'button', 'image'].include(element.type);
  });
  
  if (buttonPressed || (buttonPressed = form.getElementsBySelector('*[type=submit]').first()))
    elements.push(buttonPressed);
  
  return Form.serializeElements(elements, getHash);
}

Element.addMethods();

Remote = {
  initialize : function(options) {
    this.options = Object.extend({
      evaluateScripts : true
    }, options || {});
  },
  _makeRequest : function(options) {
    if (options.update) new Ajax.Updater(options.update, options.url, this.options);
    else new Ajax.Request(options.url, options);
    return false;
  }
};

Remote.Link = Behavior.create(Object.extend({
  onclick : function() {
    var options = Object.extend({ url : this.element.href, method : 'get' }, this.options);
    return this._makeRequest(options);
  }
}, Remote));

Remote.Form = Behavior.create(Object.extend({
  onclick : function(e) {
    var sourceElement = Event.element(e);
    
    if (sourceElement.nodeName.toLowerCase() == 'input' && 
        sourceElement.type == 'submit')
      this._submitButton = sourceElement;
  },
  onsubmit : function() {
    var options = Object.extend({
      url : this.element.action,
      method : this.element.method,
      parameters : Form.serialize(this.element, false, this._submitButton)
    }, this.options);
    this._submitButton = null;
    return this._makeRequest(options);
  }
}, Remote));

