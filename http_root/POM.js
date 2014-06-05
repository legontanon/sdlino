/* POM.js
 * Persistent Object Management
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

// TODO remotize
// writes objects localStorage

var POM = function(){

  function POtoJSON(o,keys) {
    keys = keys || o.POM_keys;
    var s = '{';

    for(var k in keys) {
      var key = keys[k];
      if (!(k in o)) continue;
      s += "'"+k+"':";

      switch (typeof(key)) {
        case 'object':
          s += POtoJSON(o[k],key) + ",";
          continue;
        case 'boolean':
          if (key) {
            s += JSON.stringify(o[k]);
          }
          continue;
        case 'string':
          s += key.printf(o[k]);
          continue;
        case 'function':
          s+= key(o[k]);
          break;
        default:
          s += JSON.stringify(o[k]);
          continue;
        // case 'number':
        //   switch(key) {
        //     default:
        //       continue;
        //   }
      }
    }

    s += '}';

  }

  var POMS = JSON.parse(localStorage.getItem('POMS')||'{}');

  var POM_all_saved = true;

  POM.prototype.get = function(key) { return this.data[key]; };

  POM.prototype.add = function(obj,keys) {
    me = obj;

    me.POM_self = me;
    me.POM_uuid = me.POM_uuid || me.uuid || uuid();
    me.POM_keys = me.POM_keys = keys || {} ;
    me.POM_toJSON = obj.toJSON || POtoJSON;

    this.data[obj.POM_uuid] = obj;

    this.saved = POM.all_saved = false;
  };

  POM.prototype.clear = function() {
    this.data = {};
    this.saved = false;
  };

  POM.prototype.save = function() {
      var raw = '{';

      for ( var k in this.data) {
        raw+= "'%s':%s,".printf(k,POtoJSON(o,o.POM_keys));
      }

      raw += '}';

      localStorage.setItem('POMS_'+this.name,raw);
      this.saved = true;
  };

  POM.prototype.save_all = function() {
    for (i in POMS) {
      var p = POMS[i];
      p.save();
    }
    POM_all_saved = true;
  };

  POM.prototype.remove = function() {
      delete POMSs[this.name];
      localStorage.removeItem('POMS_'+name);
      localStorage.setItem('POMSs',JSON.stringify(POMSs));
  };

  POM.prototype.remove_all = function() {
    for (i in POMSs) {
      var p = POMSs[i];
      p.remove();
    }
  };

  function POM(name,keys) {
    pom = POMS[name];

    if (!pom) {
        pom = POMS[name] = {
          name: name,
          saved: true,
        };
        localStorage.setItem('POMS',JSON.stringify(POMSs));
    }

    var raw = localStorage.getItem('POMS_'+name) || '{}';

    pom.data = JSON.parse(raw);
    return pom;
  }

  return POM;
}();
