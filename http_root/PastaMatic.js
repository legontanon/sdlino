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
  var me = this || {};
  me.text = text;
  me.parts = {};
  me.tree = {type:"/"};
  me.parts["/"] = me.tree;

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
      if ('subparts' in node) for (var i in node.subparts) {
        var subpart = node.subparts[i];

        if ((subpart in cobj)) {
          var obj = cobj[subpart];

          if (obj instanceof Array) {
            var alts = node.alt;
            var alt = alts[subpart];

            obj.forEach(function(iobj){
              var sp = alt ? iobj.what : subpart;

              if ((sp in node))
                body += format_(iobj,node[sp]);
              else {
                D([node,iobj]);
                throw "E: No '"+sp+"' in '"+ node.type + "'";
              }

            });
          } else {
            body += format_(obj,node[subpart]);
          }
        }
      } else {
        L("W(Template): Node '" + node.type +"' has no subparts and no body");
        D([node,cobj]);
      }
    }

    if (node.foot)
      foot += replace_tags(node.foot,cobj);

    return head+body+foot;
  }

  me.format = function(tsys) { return format_(tsys,me.tree); }

  function get_or_create_node(path) {
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
    var lines = item.split(/\n/m);
    var str = "";
    var path_line = lines.shift();
    var path = path_line.split(":");
    var p = get_or_create_node(path);
    var subparts_line = undefined;
    var alt_lines = [];
    var items = {};

    me.parts[path_line] = p;

    while (lines[0].match(alt_re)) {
      alt_lines.push(lines.shift());
    }

    if (lines[0].match(sub_re))
      subparts_line = lines.shift();

    for (var i in lines) {
      str += lines[i] + ((i==lines.length-1)?'':"\n");
    }

    str.replace(attr_re,function(m,name){ items[name]=name; });

    switch( path[path.length-1] ) {
    case '^':

      if (subparts_line) {
        p.card = {};
        p.subparts = subparts(subparts_line,p.card)
      }

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



PastaMatic.prototype.out = function () {
  this.system.timestamp = Date().toString();

  return this.template.format(this.conf);
}

function PastaMatic(system,template_txt) {
  var me = this || {};
  var t = me.template = new Template(template_txt);
  var s = me.system = clone(system);
  var c = me.conf = {};
  var confs = {
    Enum:function(o,e){},
    Type:function(o,e){},
    Sig:function(o,e){},
    Vars:function(o,e){},
    Proc:function(o,e){},
    Module:function(o,e){},
    Lib:function(o,e){},
  };

  return me;
}
