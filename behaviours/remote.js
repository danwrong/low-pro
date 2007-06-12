Remote = {
  initialize : function(options) {
    this.options = Object.extend({
      evaluateScripts : true
    }, options || {});
  },
  _makeRequest : function() {
    if (this.options.update) new Ajax.Updater(this.options.update, this.options.url, this.options);
    else new Ajax.Request(this.options.url, this.options);
    return false;
  }
};

Remote.Link = Behavior.create(Object.extend({
  onclick : function() {
    this.options = Object.extend({ url : this.element.href, method : 'get' }, this.options);
    return this._makeRequest();
  }
}, Remote));

// TODO: support serialization of submit button
Remote.Form = Behavior.create(Object.extend({
  onsubmit : function() {
    this.options = Object.extend({
      url : this.element.action,
      method : this.element.method,
      parameters : Form.serialize(this.element)
    }, this.options);
    return this._makeRequest();
  }
}, Remote));