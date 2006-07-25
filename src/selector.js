LowPro.FastSelector=Class.create();
LowPro.FastSelector.prototype = {

  initialize : function(stack) {
    this.r=[]; this.s=[]; this.i=0;  

    for (var i=stack.length-1;i>=0;i--) {

      var s=["*","",[]], t=stack[i], cursor=t.length-1;
      
      do {
        var d=t.lastIndexOf("#"), p=t.lastIndexOf(".");
        cursor=Math.max(d,p);

        if (cursor==-1) s[0]=t.toUpperCase();
        else if (d==-1 || p==cursor) s[2].push(t.substring(p+1));
        else if (!s[1]) s[1]=t.substring(d+1);
        
        t=t.substring(0,cursor);
      } while (cursor>0);
      
      this.s[i]=s;
    }
  },

  get : function(root) {
    this.explore(root || document, this.i==(this.s.length-1));
    return this.r;
  },

  explore : function(elt,leaf) {
    var s=this.s[this.i], r=[];

    if (s[1]) {
      var e=$(s[1]);      
      if (e && (s[0]=="*" || e.tagName==s[0]) && e.childOf(elt)) r=[e];
    } else r=$A(elt.getElementsByTagName(s[0]));

    if (s[2].length==1) r=r.findAll(function(o) {
        return (o.className.indexOf(" ")==-1) ? 
          o.className==s[2][0] : o.className.split(/\s+/).include(s[2][0]);
    });
    else if (s[2].length>0) r=r.findAll(function(o) {
        if (o.className.indexOf(" ")==-1) return false;
        else {
          var q=o.className.split(/\s+/);
          return s[2].all(function(c) {
            return q.include(c);
          });
        }
    });

    if (leaf) this.r=this.r.concat(r);
    else {
      ++this.i;
      r.each(function(o) {
        this.explore(o,this.i==(this.s.length-1));
      }.bind(this));
    }
  }

};

LowPro.FastSelector.old$$=$$;
function $$(a,b) {
  if (b || a.indexOf("[")>=0) return $$old.apply(this,arguments);
  return new LowPro.FastSelector(a.split(/\s+/)).get();
}
