// XPath-based optimsation for $$ ripped from RoR ticket #5171
// By Andrew Dupont <rubyonrails@andrewdupont.net>
if (document.evaluate) {
  Element.addMethods({
    getElementsByXPath: function(element, expression) {
      var results = [];
      var query = document.evaluate(expression, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0, len = query.snapshotLength; i < len; i++)
       results.push(query.snapshotItem(i));
      return results;
    },

    getElementsByClassName: function(element, className) {
      return (document.getElementsByClassName(className, element));
    },

    getElementsBySelector: function(element, expression) {
      return element.getElementsByXPath(expression.toXPath());
    }
  });

  document.getElementsByClassName = function(className, parentElement) {
    return (document.getElementsByXPath("//*[contains(concat(' ',@class, ' '), ' " + 
      className + " ')]", (parentElement || document)));
  };

  document.getElementsByXPath = function(expression) { 
    return document.body.getElementsByXPath(expression);
  };

  $$ = function() {
    return $A(arguments).map(function(expression) {
      return document.getElementsByXPath($$.cssToXPath(expression));
    }).flatten();
  }; 
  
  $$.cssToXPath = function(rule) {
    var index = 1, parts = ["//", "*"], lastRule, subRule, m, mm;
    var reg = {
      element:    /^([#.]?)([a-z0-9\\*_-]*)((\|)([a-z0-9\\*_-]*))?/i, 
      attr1:      /^\[([^\]]*)\]/,
      attr2:      /^\[\s*([^~=\s]+)\s*(~?=)\s*"([^"]+)"\s*\]/i,
      attrN:      /^:not\((.*?)\)/i,
      pseudo:     /^:([()a-z_-]+)/i,                                  
      combinator: /^(\s*[>+\s])?/i,                                   
      comma:      /^\s*,/i                                            
    };

    while (rule.length && rule != lastRule) {
      lastRule = rule;

      m = reg.element.exec(rule);
      if (m) {
        switch(m[1]) {
          case "#": 
            parts.push("[@id='" + m[2] + "']"); 
            break;                
        case ".": 
          parts.push("[contains(concat(' ', @class, ' '), ' " + m[2] + " ')]"); 
          break;
        default:
          parts[index] = (m[5] || m[2]);        
        }      
        rule = rule.substr(m[0].length);
      }

      m = reg.attr2.exec(rule);
      if (m) {
        if (m[2] == "!=") 
          parts.push("[@" + m[1] + "!='" + m[3] + "]");
        if (m[2] == "~=") 
          parts.push("[contains(@" + m[1] + ", '" + m[3] + "')]");
        else           
          parts.push("[@" + m[1] + "='" + m[3] + "']");
        rule = rule.substr(m[0].length);
      } else {
        m = reg.attr1.exec(rule);
        if (m) { 
          parts.push("[@" + m[1] + "]");
          rule = rule.substr(m[0].length);
        }
      }

      m = reg.attrN.exec(rule);
      if (m) {
        subRule = m[1];
        mm = reg.attr2.exec(subRule);
        if (mm) {
          if (mm[2] == "=")
            parts.push("[@" + mm[1] + "!='" + mm[3] + "]");
          if (mm[2] == "~=")
            parts.push(":not([contains(@" + mm[1] + ", '" + mm[3] + "')])");
        } else {
          mm = reg.attr1.exec(subRule);
          if (mm) parts.push(":not([@" + mm[1] + "])");
        }
        rule = rule.substr(m[0].length);  
      }

      m = reg.pseudo.exec(rule);
      while (m) {
        rule = rule.substr(m[0].length);
        m = reg.pseudo.exec(rule);
      }

      m = reg.combinator.exec(rule);
      if (m) {
        if (m[0].length == 0) continue;
        switch (true) {
          case (m[0].indexOf(">") != -1): 
            parts.push("/"); 
            break;
          case (m[0].indexOf("+") != -1): 
            parts.push("/following-sibling::"); 
            break;
          default:
            parts.push("//");
            break;
        } 
        index = parts.length;
        parts.push("*");
        rule = rule.substr(m[0].length);
      }

      m = reg.comma.exec(rule);
      if (m) { 
        parts.push(" | ", "//", "*");
        index = parts.length - 1;
        rule = rule.substr(m[0].length);
      }
      m = null;
    }
    return parts.join('');
  }
}
