DateSelector = Behavior.create({
  initialize: function(options) {
    this.element.addClassName('date_selector');
    this.calendar = null;
    this.options = Object.extend(DateSelector.DEFAULTS, options || {});
    this.date = this.getDate();
    this._createCalendar();
  },
  setDate : function(value) {
    this.date = value;
    this.element.value = this.options.setter(this.date);
    
    if (this.calendar)
      setTimeout(this.calendar.element.hide.bind(this.calendar.element), 500);
  }, 
  _createCalendar : function() {
    var calendar = $div({ 'class' : 'date_selector' });
    document.body.appendChild(calendar);
    calendar.setStyle({
      position : 'absolute',
      zIndex : '500',
      top : Position.cumulativeOffset(this.element)[1] + this.element.getHeight() + 'px',
      left : Position.cumulativeOffset(this.element)[0] + 'px'
    });
    this.calendar = new Calendar(calendar, this);
  },
  onclick : function(e) {
    this.calendar.show();
    Event.stop(e);
  },
  onfocus : function(e) {
    this.onclick(e);
  },
  getDate : function() {
    return this.options.getter(this.element.value) || new Date;
  }
});

Calendar = Behavior.create({
  initialize : function(selector) {
    this.selector = selector;
    this.element.hide();
    Event.observe(document, 'click', this.element.hide.bind(this.element));
  },
  show : function() {
    Calendar.instances.invoke('hide');
    this.date = this.selector.getDate();
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
               '    <tr><th class="back"><a href="#">&larr;</a></th>' +
               '        <th colspan="5" class="month_label">' + this._label() + '</th>' +
               '        <th class="forward"><a href="#">&rarr;</a></th></tr>' +
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
    
    if ($(source.parentNode).hasClassName('day')) return this._setDate(source);
    if ($(source.parentNode).hasClassName('back')) return this._backMonth();
    if ($(source.parentNode).hasClassName('forward')) return this._forwardMonth();
  },
  _setDate : function(source) {
    if (source.innerHTML.strip() != '') {
      this.date.setDate(parseInt(source.innerHTML));
      this.selector.setDate(this.date);
      this.element.getElementsByClassName('selected').invoke('removeClassName', 'selected');
      source.parentNode.addClassName('selected');
    }
  },
  _backMonth : function() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.redraw();
    return false;
  },
  _forwardMonth : function() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.redraw();
    return false;
  },
  _getDateFromSelector : function() {
    this.date = new Date(this.selector.date.getTime());
  },
  _firstDay : function(month, year) {
    return new Date(year, month, 1).getDay();
  },
  _monthLength : function(month, year) {
    var length = Calendar.MONTHS[month].days;
    return (month == 1 && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) ? 29 : length;
  },
  _label : function() {
    return Calendar.MONTHS[this.date.getMonth()].label + ' ' + this.date.getFullYear();
  },
  _dayRows : function() {
    for (var i = 0, html='', day; day = Calendar.DAYS[i]; i++)
      html += '<th>' + day + '</th>';
    return html;
  },
  _buildDateCells : function() {
    var month = this.date.getMonth(), year = this.date.getFullYear();
    var day = 1, monthLength = this._monthLength(month, year), firstDay = this._firstDay(month, year);
    
    for (var i = 0, html = '<tr>'; i < 9; i++) {
      for (var j = 0; j <= 6; j++) {
        
        if (day <= monthLength && (i > 0 || j >= firstDay)) { 
          var classes = ['day'];
          
          if (this._compareDate(new Date, year, month, day)) classes.push('today');
          if (this._compareDate(this.selector.date, year, month, day)) classes.push('selected');
          
          html += '<td class="' + classes.join(' ') + '">' + 
                  '<a href="#">' + day++ + '</a>' + 
                  '</td>';
        } else html += '<td></td>';
      }
      
      if (day > monthLength) break;
      else html += '</tr><tr>';
    }
    
    return html + '</tr>';
  },
  _compareDate : function(date, year, month, day) {
    return date.getFullYear() == year &&
           date.getMonth() == month &&
           date.getDate() == day;
  }
});

DateSelector.DEFAULTS = {
  setter: function(date) {
    return [
      date.getFullYear(), 
      date.getMonth() + 1,
      date.getDate()
    ].join('/');
  },
  getter: function(value) {
    var parsed = Date.parse(value);
    
    if (!isNaN(parsed)) return new Date(parsed);
    else return null;
  }
}

Object.extend(Calendar, {
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
});