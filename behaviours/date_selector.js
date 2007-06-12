DateSelector = Behavior.create({
  initialize: function(options) {
    this.element.addClassName('date_selector');
    this.calendar = null;
    this.options = Object.extend(DateSelector.DEFAULTS, options || {});
    this.setDate($F(this.element));
    this._createCalendar();
  },
  setDate : function(value) {
    value = value.replace(new RegExp(this.options.seperator, 'g'), '/');
    var parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      this.date = new Date(parsed);
      this.element.value = [
        this.date.getFullYear(), 
        this.date.getMonth() + 1,
        this.date.getDate()
      ].join(this.options.seperator);
    } else {
      this.date = new Date;
      this.element.value = '';
    }
  }, 
  _createCalendar : function() {
    var calendar = $div({ 'class' : 'date_selector' });
    this.calendar = new DateSelector.Calendar(calendar, this);
    this.element.addAfter(calendar);
    calendar.setStyle({
      position : 'absolute',
      zIndex : '500',
      top : Position.cumulativeOffset(this.element)[1] + this.element.getHeight() + 'px',
      left : Position.cumulativeOffset(this.element)[0] + 'px'
    });
  },
  onclick : function(e) {
    this.calendar.show();
    Event.stop(e);
  },
  onfocus : function(e) {
    this.onclick(e);
  }
});

DateSelector.Calendar = Behavior.create({
  initialize : function(selector) {
    this.selector = selector;
    this.element.hide();
    Event.observe(document, 'click', this.element.hide.bind(this.element));
  },
  show : function() {
    this._getDateFromSelector();
    this.redraw();
    this.element.show();
    this.active = true;
  },
  hide : function() {
    this.element.hide();
    this.active = false;
  },
  redraw : function() {
    var html = '<table class="calendar">' +
               '  <thead>' +
               '    <tr><th class="back">&larr;</th>' +
               '        <th colspan="5" class="month_label">' + this._label() + '</th>' +
               '        <th class="forward">&rarr;</th></tr>' +
               '    <tr class="day_header">' + this._dayRows() + '</tr>' +
               '  </thead>' +
               '  <tbody>';
    html +=    this._buildDateCells();
    html +=    '</tbody></table>';
    this.element.innerHTML = html;
  },
  onclick : function(e) {
    var source = Event.element(e);
    Event.stop(e);
    
    if (source.hasClassName('day')) return this._setDate(source);
    if (source.hasClassName('back')) return this._backMonth();
    if (source.hasClassName('forward')) return this._forwardMonth();
  },
  _setDate : function(source) {
    if (source.innerHTML.strip() != '') {
      this.selector.setDate([this.date.getFullYear(), this.date.getMonth() + 1, source.innerHTML].join('/'));
      this.element.hide();
    }
  },
  _backMonth : function() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.redraw();
  },
  _forwardMonth : function() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.redraw();
  },
  _getDateFromSelector : function() {
    this.date = new Date(this.selector.date.getTime());
  },
  _firstDay : function(month, year) {
    return new Date(year, month, 1).getDay();
  },
  _monthLength : function(month, year) {
    var length = DateSelector.Calendar.MONTHS[month].days;
    return (month == 1 && (year % 4 == 0) && (year % 100 != 0)) ? 29 : length;
  },
  _label : function() {
    return DateSelector.Calendar.MONTHS[this.date.getMonth()].label + ' ' + this.date.getFullYear();
  },
  _dayRows : function() {
    for (var i = 0, html='', day; day = DateSelector.Calendar.DAYS[i]; i++)
      html += '<th>' + day + '</th>';
    return html;
  },
  _buildDateCells : function() {
    var month = this.date.getMonth(), year = this.date.getFullYear();
    var day = 1, monthLength = this._monthLength(month, year), firstDay = this._firstDay(month, year);
    
    for (var i = 0, html = '<tr>'; i < 9; i++) {
      for (var j = 0; j <= 6; j++) {
        html += '<td class="day' + this._selectedClass(year, month, day) + ((j == 0 || j == 6) ? ' weekend' : '') + '">';
        if (day <= monthLength && (i > 0 || j >= firstDay)) 
          html += day++;
        html += '</td>';
      }
      
      if (day > monthLength) break;
      else html += '</tr><tr>';
    }
    
    return html + '</tr>';
  },
  _selectedClass : function(year, month, day) {
    return (this.selector.date.getFullYear() == year &&
            this.selector.date.getMonth() == month &&
            this.selector.date.getDate() == day) ? ' selected' : '';
  }
});

DateSelector.DEFAULTS = {
  seperator : '/'
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
    { label : 'October', days : 31 },
    { label : 'November', days : 30 },
    { label : 'December', days : 31 }
  ]
})