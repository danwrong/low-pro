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
    return this._makeRequest();
  }
}, Remote));

// TODO: support serialization of submit button
Remote.Form = Behavior.create(Object.extend({
  onsubmit : function() {
    var options = Object.extend({
      url : this.element.action,
      method : this.element.method,
      parameters : Form.serialize(this.element)
    }, this.options);
    return this._makeRequest(options);
  }
}, Remote));