/* HtmlDlg.js
 * simple HTML Dialogs
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

var _HtmlDlg = {}

HtmlDlg.prototype.cancel =  function () {
  this.div.remove();
  delete _HtmlDlg[this.id];
  return false;
}

HtmlDlg.prototype.ok =  function () {
  if (this.cb) {
    var params = {};

    for (var item in this.params) {
      var name = this.params[item];
      var val = document.getElementById("Dlg_" + name).value;
      params[name] = val;
    }
    try { this.cb(params); } catch (e) { L("HtmlDlg CB:",e)};
    this.cb = null;
  }

  return this.cancel();
}

function HtmlDlg(cont,title,cb,params,defaults) {
  this.id = uuid();
  this.cont = document.getElementById(cont);
  var css = " position: absolute; top: 10%; left: 10%; min-width: 10%; min-height: 20%; border: 2px solid; border-radius: 10px; box-shadow: 10px 10px 5px #888888; background-color: #cccccc; z-index:1001; padding-top:25px; padding-bottom:25px; padding-right:50px; padding-left:50px; "
  this.cont.innerHTML += '<div id="%s" style="%s"></div>'.printf(this.id,css);
  this.div = document.getElementById(this.id);

  this.cb = cb;
  this.params = params;
  this.defaults  = defaults;
  this.title = title || '-';

  var html = "<table width='100%'><form  onSubmit='_HtmlDlg[\"{id}\"].ok(); return false;'><tr><td align='center'><h1>{title}</h1></td></tr>".printf(this);

  if (typeof(params) == 'object') for (var item in params) {
    var name = params[item];

    html += "<tr><td align='right'>" + name + ":</td><td>"


    if (defaults) {
      var dflt = defaults[item];

      if (typeof(dflt) == 'object') {

         html += "<select name='"+name+"' id='Dlg_" + name + "'>";

        for (var i in dflt) {
          var t = dflt[i];
            html += "<option value='"+t+"'>"+t+"</option>";
        }

        html += "</select>";

      } else if ( typeof(dflt) == 'string' ) {
          html += "<input type='text' name='" + name + "' id='Dlg_" + name + "' value='" + dflt + "'>" ;
      } else {
          html += "<input type='text' name='" + name + "' id='Dlg_" + name + "'>" ;
      }
    } else {
       html += "<input type='text' name='" + name + "' id='Dlg_" + name + "'>" ;
    }

      html+= "</td></tr>";
  }

    html += "<tr><td colspan='2' align='right'>";
    html += "<input type='button' value='Cancel' onClick='_HtmlDlg[\""+this.id+"\"].cancel()'>";
    html += "<input type='button' value='OK' onClick='_HtmlDlg[\""+this.id+"\"].ok()'>";
    html += "</td></tr></form></table>";

  this.div.innerHTML = html;

  _HtmlDlg[this.id] = this;
}

// text dialog

HtmlTxtBox.prototype.cancel = HtmlDlg.prototype.cancel;

HtmlTxtBox.prototype.ok = function () {
 if (this.cb) {
   var val = document.getElementById(this.txt_id).value;

  try { this.cb(val); } catch (e) { L("HtmlTxtBox CB:",e)};

   this.cb = null;
 }

 return this.cancel();
}

function HtmlTxtBox(cont,title,cb,dflt) {
  this.id = uuid();
  this.cont = document.getElementById(cont);
  this.cb = cb;
  var css = " position: absolute; top: 10%; left: 10%; min-width: 10%; min-height: 20%; border: 2px solid; border-radius: 10px; box-shadow: 10px 10px 5px #888888; background-color: #cccccc; z-index:1001; padding-top:25px; padding-bottom:25px; padding-right:50px; padding-left:50px; "
  this.cont.innerHTML += '<div id="%s" style="%s"></div>'.printf(this.id,css);
  this.txt = dflt;
  this.txt_id = "txt_"+this.id;
  this.div = document.getElementById(this.id);

  tid = JSON.stringify(this.id);

  var html = "<form  onSubmit='_HtmlDlg["+tid+"].ok(); return false;'><table width='100%'><tr><td align='center'><h1>"+title+"</h1></td></tr>";

    html += "<tr><td><textarea id='"+this.txt_id+"' rows='10' cols='60'>" + (dflt?dflt:"") + "</textarea></td></tr>";

    html += "<tr><td align='right'>";
    html += "<input type='button' value='Cancel' onClick='_HtmlDlg["+tid+"].cancel()'>";
    html += "<input type='button' value='OK' onClick='_HtmlDlg["+tid+"].ok()'>";
    html += "</td></tr></table></form>";

  this.div.innerHTML = html;
  _HtmlDlg[this.id] = this;
}


HtmlMenu.prototype.cancel = HtmlDlg.prototype.cancel
HtmlMenu.prototype.click = function(i) {
  try { this.cancel(); this.cb[i](); } catch(e){ debug.log("HtmlMenu CB:",e); }
  return false;
}


function HtmlMenu(cont,title,items) {
  this.id = uuid();
  this.cont = document.getElementById(cont);
  var css = " position: absolute; top: 10%; left: 10%; min-width: 10%; min-height: 20%; border: 2px solid; border-radius: 10px; box-shadow: 10px 10px 5px #888888; background-color: #cccccc; z-index:1001; padding-top:25px; padding-bottom:25px; padding-right:50px; padding-left:50px; "
  this.cont.innerHTML += '<div id="%s" style="%s"></div>'.printf(this.id,css);
  this.div = document.getElementById(this.id);
  this.cb = {}
  tid = JSON.stringify(this.id);

  var html = "<table width='100%'><h1>"+title+"</h1></td></tr>";
  var me = this;
  if (typeof(items) == 'object') items.forEach(function(item) {
    me.cb[item.name] = item.cb;
    html += "<tr><td align='right'><a onClick='_HtmlDlg["+tid+"].click(\""+item.name+"\")'>"
    + item.text || item.name + "</a></td><td>"
    + "</td></tr>";
  });

    html += "<tr><td align='right'>";
    html += "<form><input type='button' value='Cancel' onClick='_HtmlDlg["+tid+"].cancel()'></form>";
    html += "</td></tr></table>";

  this.div.innerHTML = html;
  _HtmlDlg[this.id] = this;
}


// TODO finish this
DynTr.prototype.up = function (){}
DynTr.prototype.dn = function (){}
DynTr.prototype.remove = function (){}
DynTr.prototype.edit = function (){}
DynTr.prototype.html = function (){}

function DynTr(parent,obj) {}

DynTable.prototype.add_row = function(obj) {}
DynTable.prototype.rm_row = function(obj) {}


function DynTable(cont,structure,obj) {
  var c = document.getElementByID(cont)
  this.struct = struct;

  c.innerHTML += html;
  return this;
}
