/* PastaMatic.js
 * Spaghetti Code Generator
 *
 * SDLino - An SDL implementation
 * (c) 2014 Luis Enrique Garcia Ontañon <luis@ontanon.org>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


function Template(text) {
  me = this || {};
  me.text = text;
  me.parts = {};
  me.tree = {type:""};

  function dump_tree_(p,off) {
    var str = off + p.type + ":\n"

    try {
      p.subparts.forEach(function(t) {
      if (typeof(t) == 'string' && t in p && p[t].type ) {
          str += dump_tree_(p[t],off+" ");
        }
      });
    } catch(e) {;}

    return str;
  }

  function tree_foreach_(p,cb_in,cb_out) {
    cb_in && cb_in(p);
    try {
      p.subparts.forEach(function(t) {
      if (typeof(t) == 'string' && t in p && p[t].type ) {
          tree_foreach_(p[t],cb_in,cb_out);
        }
      });
    } catch(e) {;}
    cb_out && cb_out(p);
  }

  me.dump_tree = function() { dump_tree_(me.tree,""); }

  me.tree_forerach = function(cb_in,cb_out)  { tree_foreach_(me.tree,cb_in,cb_out); }

  function replace_tags(str,vals) {
    return str.replace( /{{([a-z0-9_]+)}}/mig, function(match,p1,offset,string) {
       //L(p1,vals[p1]);
      return p1 in vals ? vals[p1] : '';
    } );
  }

  function format_(cobj,node) {
    var head = '';
    var body = '';
    var foot = '';

    if (node.head)
      head += replace_tags(node.head,cobj);

    if (node.body) {
      body += replace_tags(node.body,cobj);
    } else {
      for (var i in node.subparts) {
        var subpart = node.subparts[i];

        if ((subpart in cobj)) {
          var obj = cobj[subpart];

          if (obj instanceof Array) {
            var alts = node.alt;
            var alt = alts[subpart];

            obj.forEach(function(iobj){
              var sp = alt ? iobj.what : subpart;
              body += format_(iobj,node[sp]);
            });
          } else {
            body += format_(obj,node[subpart]);
          }
        }
      }
    }

    if (node.foot)
      foot += replace_tags(node.foot,cobj);

    return head+body+foot;
  }

  me.format = function(tsys) { return format_(tsys,me.tree); }

  me.get_or_create_node = function (path) {
    var place = me.tree;

    for(var i=0; i < path.length; i++) {
      var c = path[i];

      if (c == '^') {
        break;
      } else if (c == '$') {
        break;
      }

      if (c in place) {
        place = place[c];
        continue;
      } else {
        // L("Creating",c,place);
        place = place[c] = {type:c == undefined ? "" : c };
        continue;
      }
    }

    return place;
  }

  me.get_node = function (path) {
    var last_place = me.tree;
    var c;

    while( c = path.shift()) {
      if (c in place) {
        place = place[c];
        continue;
      } else {
        return undef;
      }
    }

    return place;
  }

  var index = 0;

  var sp = text.split(/^\/\/\//m);
  delete sp[0];

  var attr_re = /{{([a-z_]+)}}/g;
  var sub_re = /^\/\/:(.*)/;
  var alt_re = /\/\/=\s*([a-z0-9]+)\s*{\s*([a-z0-9 ]+?)\s*}/i;
  var chomp_re = /\s*([^]*?)\s*/;

  function subparts(text,card) {
    try {
      var re = /([A-Z0-9]+)([+]?)/gi;
      var o = [];

      var line = text.match(sub_re)[0];

      line.replace(re,function(m,n,c) {
        card[n] = c;
        o.push(n);
      });

      return o;
    } catch(e) {
      L(e);
      return undefined;
    }
  }


  function chomp(str) {
      return str.replace(chomp_re,function(m,p){return p;})
  }

function ize(io) {
  var oo = {};
  for(var i in io) {
    oo[io[i]] = true;
  }
  return oo;
}
  function alts(texts) {
    var o = {};

    for (var i in texts) {
      var text = texts[i];
      var m = text.match(alt_re);
      var name = chomp(m[1]);
      var items = chomp(m[2]).split(/\s+/);
      o[name]=ize(items);
    }

    return o;
  }

  sp.forEach(function(item){
    var s = item.split(/\n/m);
    var str = "";
    var path_line=s.shift();
    var path = path_line.split(":");
    var p = me.get_or_create_node(path);
    var subparts_line = undefined;
    var alt_lines = [];
    var items = {};

    while (s[0].match(alt_re)) {
      alt_lines.push(s.shift());
    }

    if (s[0].match(sub_re))
      subparts_line = s.shift();

    for (var i = 0; i<s.length; i++) {
      str += s[i] + ((i==s.length-1)?'':"\n");
    }

    str.replace(attr_re,function(m,name){ items[name]=name; });

    switch( path[path.length-1] ) {
    case '^':
      p.card = {};
      p.subparts = subparts_line ? subparts(subparts_line,p.card) : [];
      p.alt = alts(alt_lines);
      p.head = str;
      p.items = items;

      break;
    case '$':
      p.foot = str;
      for (var i in items) if (! (i in p.items)) p.items[i] = i;
      break;
    default:
      p.body = str;
      p.items = {};

      for (var i in items) {
        p.items[items[i]] = items[i];
      }
      break;
    }
  });

  return me;
}

//   expr = add
//   adder = add
//        / sub
//        / multer
//
//   add =  l:multer '+' r:adder { return {Op:'+',L:l,R:r}; }
//   sub = l:multer '-' r:adder { return {Op:'-',L:l,R:r}; }
//   multer = mult
//           / div
//           / pr
//   mult = l:pr '*' r:multer { return {Op:'+',L:l,R:r}; }
//   div = l:pr '/' r:multer { return {Op:'/',L:l,R:r}; }
//   pr = paren
//      / literal
//      / q_name
//   paren = '(' e:expr ')' { return e; }
//   literal = digits:[0-9]+ { return {Val:'Int',value:parseInt(digits.join(""),10)}}
//   var = q:var_name ':' n:elem_name {return {Qual:q,Name:n} }
//   var_name = name
//         / var_name ':' name  {}
//   name = letters:[a-zA-Z][A-Za-z0-9]+ {}


Template.prototype.get_item_subtypes = function() {
  var s = [];



  return s;
}



PastaMatic.prototype.compile = function () {
  this.system.timestamp = Date().toString();
  var parts = this.template.parts;


  var typedefs = '';
  var typedecls = '';
  L(this);
  var types = this.system.types;

  for (var i in types ) {
    var type = types[i];
    typedecls += replace_tags(parts.TypeDecl  || '', type);
    typedefs += hif_replace("TypeDef",type,type.items,type);
  }

  var procdecls = '';
  var procdefs = '';
  var procs = this.system.procs;
  for (var i in procs) {
    var proc = procs[i];
      procdecls += hif_replace("ProcDecl",proc,proc.vars,proc);

      procdefs += replace_tags(parts.ProcDefHead  || '', proc);

      for (var j in procd.vars) {
        procdefs += replace_tags(parts.ProcDefVar  || '', proc.vars[j]);
      }

      procdefs += replace_tags(parts.ProcDefSwitch  || '', procd);

      for (var i in procd.items) {
        var item = procd.items[i];
        procdefs += replace_tags(parts[item.type]  || '', item);
      }

      procdefs += replace_tags(parts.ProcDefFoot  || '', procd);
  }


  return replace_tags(parts.Header || '', this.system)
        + typedecls + procdecls + typedefs + procdefs
        + replace_tags(parts.Footer || '', this.system);
}

function PastaMatic(system,template) {
  this.template = template;
  this.system = system;
  // this.expr_parser = PEG.buildParser(expr_parser);
  // this.cond_parser = PEG.buildParser(cond_parser);

}
