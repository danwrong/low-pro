DateSelector = Behavior.create({
  initialize: function(options) {
    this.calendar = null;
    this.options = Object.extend(DateSelector.DEFAULTS, options);
    this.setDate($F(this.element));
    this._createCalendar();
  },
  setDate : function(value) {
    var parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      this.date = new Date(parsed);
      this.year = this.date.getYear();
      this.month = this.date.getMonth();
      this.element.value = '' ; // put in the date in a specific formate...config this?
      return true;
    } else return false;
  }, 
  _createCalendar : function() {
    var calendar = $div({ 'class' : 'date_selector' });
    this.calendar = new DateSelector.Calendar(calendar, this);
  },
  onclick : function(e) {
    if (this.calendar.active) this.calendar.hide();
    else this.calendar.show();
  }
});

DateSelector.Calendar = Behavior.create({
  initialize : function(selector) {
    this.selector = selector;
    this.element.hide();
  },
  show : function() {
    this.redraw();
    this.element.show();
    this.active = true;
  },
  hide : function() {
    this.element.hide();
    this.active = false;
  },
  onclick : function(e) {
    // event delegation
  },
  _firstDay : function(month, year) {
    return new Date(year, month, 1).getDay();
  }
});

DateSelector.DEFAULTS = {
  startDay : 1
}

Object.extend(DateSelector.Calendar, {
  DAYS : $w('S M T W T F S'),
  MONTHS : [
    { label : 'January', days : 31 },
    { label : 'February', days : 28 },
    { label : 'March', days : 31 },
    { label : 'April', days : 30 },
    { label : 'May', days : 31 },
    { label : 'June', days : 30 },
    { label : 'July', days : 31 },
    { label : 'August', days : 31 },
    { label : 'September', days : 30 },
    { label : 'October', days : 31 }
    { label : 'November', days : 30 }
    { label : 'December', days : 31 }
  ]
})