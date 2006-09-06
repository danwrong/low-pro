BehaviorDebugger = {
  STYLES : "border: 1px solid gray; position : fixed; top : 10px; right: 10px; width: 25%; background: lightgray; " +
           "font-family: sans-serif; font-size: 12px",
  HEAD_STYLES : "margin : 0; padding: 5px; font-size: 18px; background: black; color: white;",
  TABLE_STYLES : "width: 100%; margin: 5px 0;",
  HIGHLIGHT_BORDER : "1px solid red",
  open : function() {
    if (!this.debuggerPane) 
      this._createDebugger();
      
    this.debuggerPane.show();
  },
  close : function() {
    this.debuggerPane.hide();
  },
  toggle : function() {
    !this.debuggerPane || this.debuggerPane.style.display == 'none' ? this.open() : this.close();
  },
  _createDebugger : function() {
    this.debuggerPane = $div({id : 'debugger', style : this.STYLES},
      $h2({ style: this.HEAD_STYLES }, 'Low Pro Behavior Debugger')
    );
    
    this.behaviorTable = $table({ style: this.TABLE_STYLES },
      $thead(
        $tr( $th('selector'), $th('behavior') )
      ),
      $tbody()
    );
    
    this.debuggerPane.appendChild(this.behaviorTable);
    document.body.appendChild(this.debuggerPane);
    this._updateTable();
  },
  _updateTable : function() {
    var body = this.behaviorTable.tBodies[0], rules = Event.addBehavior.rules;
    for (var rule in rules) {
      body.appendChild(
        $tr(
          $td($a({ href : '#', onclick : 'return BehaviorDebugger._showApplied(this)' }, rule)), 
          $td(this._behaviorString(rules[rule]))
        )
      );
    }
  },
  _behaviorString : function(func) {
    return func.toString().replace(/(^function\s\(.*\)\s\{)|(\}$)/g, '');
  },
  _showApplied : function(el) {
    $$(el.firstChild.nodeValue.split(':').first()).each(function(el) {
      el.style.border = this.HIGHLIGHT_BORDER;
    });
    return false;
  }
}

//Event.onReady(BehaviorDebugger.open.bind(BehaviorDebugger));