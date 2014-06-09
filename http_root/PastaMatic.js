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


Template.prototype.re = "^(///([a-z][a-z0-9]+)\n([^]*?)\n)(///[a-z][a-z0-9]+)";


function Template(text) {
  me = this;
  me.text = text;
  me.parts = {};

  var index = 0;

  var sp = text.split(/^\/\/\//m);
  delete sp[0];

  sp.forEach(function(item){
    var s = item.split(/\n/m);
    var str = "";
    for (var i = 1; i<s.length; i++) str += s[i] + "\n";
    me.parts[s[0]] = str;
    // L(str);
  });
}

Pastamatic.prototype.expr_grammar = "start\n
  start = expr
  expr = add
  adder = add
       / sub
       / multer

  add =  l:mult '+' r:add { return {Op:'+',L:l,R:r}; }
  sub = l:mult '-' r:add { return {Op:'-',L:l,R:r}; }
  multer = mult
          / div
          / pr
  mult = l:pr '*' r:multer { return {Op:'+',L:l,R:r}; }
  div = l:pr '/' r:multer { return {Op:'/',L:l,R:r}; }
  pr = paren
     / literal
     / q_name
  paren = '(' e:expr ')' { return e; }
  literal = digits:[0-9]+ { return {Val:'Int',value:parseInt(digits.join(""),10)}}
  var = q:var_name ':' n:elem_name {return {Qual:q,Name:n} }
  var_name = name
        / var_name ':' name  {} /* */
  name = letters:[a-zA-Z][A-Za-z0-9]+ {}
"



PastaMatic.prototype.compile = function () {
  this.system.timestamp = Date().toString();
  var parts = this.template.parts;

  function replace_tags(str,vals) {
    return str.replace( /{{([a-z0-9_]+)}}/mig, function(match,p1,offset,string) {
       //L(p1,vals[p1]);
      return p1 in vals ? vals[p1] : '';
    } );
  }

  function hif_replace(suffix,head,items,foot) {
    var header = replace_tags(parts[suffix+"Head"]  || '', head);
    var footer =  replace_tags(parts[suffix+"Foot"]  || '', foot);
    var body = '';
    items.forEach(function(i){
      body += replace_tags(parts[suffix+"Item"]  || '', i);
    });
    return header + body + footer;
  }

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
  this.expr_parser = PEG.buildParser(expr_parser);
  this.cond_parser = PEG.buildParser(cond_parser);

}
