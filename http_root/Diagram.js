/* Diagram.js
 * Diagramming Elements and connections.
 *
 * $Id:$
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

function DiagramSpace(cont) {
    var ds = this;
    var plane = document.getElementById(cont);
    var paper = Raphael(plane);
    // TODO win size

    var name_text;
    var desc_txt;


    // comments


    function cardinalize(obj) {
      var bbox = obj.getBBox();

      var x = (bbox.x);
      var y = (bbox.y);
      var xx = (bbox.width);
      var yy = (bbox.height);
      var mx = bbox.hmiddle = x + xx/2;
      var my = bbox.vmiddle = y + yy/2;
      var yyy = bbox.bottom = y + yy;
      var xxx =  bbox.right = x + xx;

        bbox.N={x:mx,y:y};
        bbox.S={x:mx,y:yyy};
        bbox.E={x:x,y:my};
        bbox.W={x:xxx,y:my};
        bbox.NE={x:x,y:y};
        bbox.NW={x:xxx,y:y};
        bbox.SE={x:x,y:yyy};
        bbox.SW={x:xxx,y:yyy};
        bbox.C={x:mx,y:my};

        var px = {A:x,B:x+xx/4,C:x+2*xx/4,D:x+3*xx/4,E:x+xx};
        var py = {A:y,B:y+yy/4,C:y+2*yy/4,D:y+3*yy/4,E:y+yy};

        for (var ix in px) {
          for (var iy in py) {
            bbox[ix+iy]={x:px[ix],y:py[iy]};
          }
        }

        for (var i in bbox) {
          var o = bbox[i];
          if (typeof(o)!="object") continue;
          o.str = o.x + "," + o.y;

        }
        obj.card = bbox;
      return obj;
    }

    ds.paths = {
      // 2 do more paths.
        box: function (b) {
          return "M"+ b.NE.str
            + "L" + b.SE.str
            + "L" + b.SW.str
            + "L" + b.NW.str
            + "Z"
        },

        wait: function (b) {
          return "M"+ b.CA.str
            + "L" + b.CC.str
            + "L" + b.EC.str
            + "L" + b.EB.str
            + "L" + b.DB.str
            + "L" + b.DA.str
            + "Z"
        },

        comment: function(b) {
          var x = b.NW.x;
          var y = b.NW.y;
          var yy = b.NW.y+12;
          var xx = b.NW.x-12;

          return "M"+ b.NE.str
            + "L" + b.SE.str
            + "L" + b.SW.str
            + "L" + x + "," + yy
            + "L" + xx + "," + y
            + "L" + xx + "," + yy
            + "L" + x + "," + yy
            + "L" + xx + "," + yy
            + "L" + xx + "," + y
            //+"L" + b.C.str;
            + "Z"
        },

        procedure: function (b) {
          var x = b.NE.x;
          var y = b.NE.y;
          var yy = b.SE.y;
          var xxx = x+xx-12;
          var xx = x+12;

          var aA = xx +","+ y
          var aE = xx +","+ yy
          var eA = xxx  +","+ y
          var eE = xxx +","+ yy

          return "M"+ aA
            + "L" + aE
            + "M" + aA
            + "L" + b.NE.str
            + "L" + b.SE.str
            + "L" + b.SW.str
            + "L" + b.NW.str
            + "L" + eA
            + "L" + eE
            + "M" + eA
            + "Z"
        },

        input : function (b) {
          return "M"+ b.AA.str
            + "L" + b.BC.str
            + "L" + b.AE.str
            + "L" + b.EE.str
            + "L" + b.EA.str
            + "Z"
        },

        cond : function (b) {
          return "M"+ b.N.str
            + "L" + b.E.str
            + "L" + b.S.str
            + "L" + b.W.str
            + "Z"
        },


        output: function (b) {
          return "M"+ b.AA.str
            + "L" + b.AE.str
            + "L" + b.DE.str
            + "L" + b.EC.str
            + "L" + b.DA.str
            + "Z"
        },

        state : function (b) {
          return "M"+ b.BA.str
            + "A" + (b.height/4) +" "+ (b.width/4) + " 0 0 0 " + b.BE.str
            + "L " + b.DE.str
            + "A" + (b.height/4) +" "+ (b.width/4) + " 180 0 0 " + b.DA.str
            + "Z" ;
        },

        src : function(b) {
          return "M" + b.N.str
                  + "S" + b.W.str
                  + "S" + b.S.str
                  + "S" + b.E.str
                  + "S" + b.N.str
                  + "Z"
        }
    }

    ds.paths.signal = ds.paths.output;
    ds.paths.dst = ds.paths.src;

    var flow_line = paper.path("").attr({'stroke':'#FF0000'});
    flow_line.hide();

    var flow = null;
    var flow_dsts = {}

    function for_dsts(action,tt) {
      // L("===>",action,tt);
      for (var i in flow_dsts) {
        var d = flow_dsts[i];
        if (tt) {
          if (d.dst_type==tt) {
            // L("=====>",tt,d.dst_type)
            d[action]();
          }
        } else {
          d[action]();
        }
      }
    }

    function dst_show(type) { for_dsts('show',type); }
    function dst_hide(type) { for_dsts('hide',type); }



    _ElemHides = {}

    function new_elem(text,type,draggable) {
      var path = ds.paths[type]; //L(type)
      paper.setStart();
      var t = paper.text(0,0,".\n--"+text+"--\n.").attr({'text-anchor':'start','font-size':12});
      var c = cardinalize(t).card;
      t.attr('text',text);
      var r = paper.path(path(c)).attr("fill","#CCCCCC");
      var destinations = paper.set();
      var bs = paper.set();
      var s = paper.setFinish();
      var sources = paper.set();
      var srcs = [];
      var dsts = [];
      var btns = [];
      var children = [];

      s.label = t;
      s.body = r;
      s._btns = btns;
      s._dsts = dsts;
      s._children = children;
      s.d_children = [];
      s.d_parent = undefined;

      cardinalize(r);
      s.card = r.card;
      t.attr('x',(t.attr('x')+5));

      s.text = t;
      s.rect = r;
      s.name = name;
      var P;

      s.addDst = function(type,cp,cb) {
        function card() { return s.rect.card[cp] };
        var c = card();
        var o = paper.circle(c.x, c.y, 5,5).attr('fill','#FFFF00');

        o.type = o.dst_type = type;
        o.pos = cp;
        o.parent_element = s;
        o.cb = cb;

        o.position = card;
        o.redraw = nop;

        var id = uuid();

        o.set_type = function(new_type) { o.type = type = o.dst_type = new_type; }
        o.choose = function(){
          if (flow) {
            o.attr('fill','#FF0000');
            flow.dst = s;
            flow.flowDst = o;
          }
        }

        o.enable = function() {
          o.mouseover(function(){o.choose()});
          o.mouseout(function() {
            if (flow) {
              o.attr('fill','#FFFF00');
              // delete flow.dst;
              // delete flow.flowDst;
            }
          });

          o.disable = function () {
            o.unmouseover();
            o.unmouseout();
            o.disable = nop;
            o.hide();
            //o.extract();
          }
        }

        var x = c.x;
        var y = c.y;
        var ox = x;
        var oy = y;
        var lx;
        var ly;

        o.enable();

        flow_dsts[id] = o;

        o.extract = function() {
          delete flow_dsts[id];
        }

        o.hide();

        destinations.push(o);
        dsts.push(o);
        redraw_srcdst();
        return o;
      }


      var joint_paths = { // TODO complete!
        'N':{
          'N':function(p1,p4){ // untested
            var y = (p4.y > p1.y ? p4.y : p1.y) + 50;

            return "M"+p1.str
                   + "L"+p1.x+","+y
                   + "L"+y+","+p4.x
                   + "L"+p4.str
                   + "l-3,5 l6,0 l-3,-5"
          },
          'S':function(p1,p4){ // untested
            var y = (p4.y + p1.y)/2;
            return "M"+p1.str
                   + "L"+p1.x+","+y
                   + "L"+y+","+p4.x
                   + "L"+p4.str
                   + "l-3,-5 l6,0 l-3,5"
          },
          'E':function(){ return "M"+ p1.str + "L" + p2.str; }, // dummy
          'W':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
        },'S':{
          'N':function(p1,p4){
            var y = (p4.y + p1.y)/2;

            return "M"+p1.str
                   + "L"+p1.x+","+y
                   + "L"+p4.x+","+y
                   + "L"+p4.str
                   + "l-3,-5 l6,0 l-3,5"
          },
          'S':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'E':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'W':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
        },'E':{
          'N':function(p1,p4){
            return "M"+p1.str
                   + "L"+p4.x+","+p1.y
                   + "L"+p4.str
                   + "l-3,-5 l6,0 l-3,5"
          },
          'S':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'E':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'W':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
        },'W':{
          'N':function(p1,p4){
            return "M"+p1.str
                   + "L"+p4.x+","+p1.y
                   + "L"+p4.str
                   + "l-3,-5 l6,0 l-3,5"
          },
          'S':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'E':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
          'W':function(){ return "M"+ p1.str + "L" + p2.str; },// dummy
        }};

      function joint_path(ss,dd) {
        var ps = ss.position();
        var pd = dd.position();
        var str = joint_paths[ss.pos][dd.pos](ps,pd);
        // L("J=>",ps,pd,str)
        return str;
      }

      s.addSrc = function(type,cp,join_cb) {
        // L(type,join_cb,obj,cp)
          function card() { return s.rect.card[cp] };
          var c = card();
          var o = paper.circle(c.x, c.y,5,5).attr('fill','#ffffff');
          o.pos = cp;
          o.parent_element = s;
          o.redraw = nop;
          o.src_type = type;
          var x = c.x;
          var y = c.y;
          var ox = x;
          var oy = y;
          var lx = x;
          var ly = y;

          o.position = card;
          s.joint_hide = s.joint_show = s.joint_remove = nop;
          join_cb = join_cb || r_true;

          function s_drag_move(dx,dy,x,y) {
            lx = ox + dx;
            ly = oy + dy;
            flow_line.attr('path', "M"+ ox +","+ oy + "L"+ (lx)+"," + (ly) )
          }

          function s_drag_start() {
            var bbox = o.getBBox();
            flow_line.toFront();

            ox = bbox.x + bbox.width/2;
            oy = bbox.y + bbox.height/2;
            // 2do better

            flow = {src:s,flowSrc:o};
            dst_show(o.src_type);
            flow_line.attr('path',"M"+ o.attr("x") +","+ o.attr("y"));
            flow_line.show();
          }

          function s_drag_stop() {
            x = lx;
            y = ly;
            flow_line.hide();
            dst_hide();

            if ( flow.src && flow.dst) {

              if (join_cb(flow)) {
                // create joint
                var ss = flow.flowSrc;
                var dd = flow.flowDst;

                if (dd.cb) dd.cb(flow);

                s.d_children.push(flow.dst);
                dd.d_parent = ss;

                var p = dd.joint = paper.path(joint_path(ss,dd)).attr({
                  'stroke-width':"3px",
                  'stroke-color':"black"
                });

                o.redraw = ss.redraw = dd.redraw = function() {
                  //L(joint_path(ss,dd));
                  p.attr("path",joint_path(ss,dd));
                }

                //dd.parent_element.undrag();
                children.push(dd.parent_element);
                dd.parent_element.joint_hide = function() { p.hide(); }
                dd.parent_element.joint_show = function() { p.show(); }
                s.joint_remove = function() { p.remove(); }

                flow.flowDst.disable();
                flow.flowSrc.disable();
              }
            }
          }

          o.__hide = o.hide;


          o.disable = function () {
            o.undrag();
            o.hide();
        }

        o.joinTo = function(dst) {
          s_drag_start();
          dst.choose();
          s_drag_stop();
        }

        o.drag(s_drag_move,s_drag_start,s_drag_stop);
        sources.push(o);
        srcs.push(o);
        redraw_srcdst();

        return o;
      }

      function redraw_srcdst() {
        cardinalize(s.rect);
        // L(text+" ===",srcs,dsts);
          for (i in srcs) {
            var src = srcs[i];
            var s_pos = {x:s.rect.card[src.pos].x,y:s.rect.card[src.pos].y};
// L(text+" S",src)

            if (src.joint) {
              // L(src)
              src.redraw();
            } else {
              src.attr(s_pos);
            }
          }

          for (i in dsts) {
            var dst = dsts[i];
            s.exclude(s.rect);
            var d_pos = {x:s.rect.card[src.pos].x,y:s.rect.card[src.pos].y};
// L(text+" D",dst)
            s.push(s.rect);
            if (dst.joint) {
              // L(dst)
              dst.redraw();
            } else {
              dst.attr(d_pos);
            }
          }
      }

      var x=0;
      var y=0;
      var lx;
      var ly;
      var ox;
      var oy;
      var xx;
      var yy;




      function drag_move(dx,dy,XX,YY){
        lx = ox + dx;
        ly = oy + dy;
        s.attr("transform",('T' + lx + ',' + ly));
        children.forEach(function(c){c.drag_move(dx,dy,XX,YY);});
      }
      s.drag_move=drag_move;

      function drag_start() {
          ox = x;
          oy = y;
          s.push(destinations);
          s.push(sources);
          children.forEach(function(c){c.drag_start();});
          s.joint_hide()
      }
      s.drag_start=drag_start;

      function drag_stop(){
          x = lx;
          y = ly;
          s.exclude(destinations);
          s.exclude(sources);
          cardinalize(r);
          redraw_srcdst();
          children.forEach(function(c){c.drag_stop();});
          s.joint_show()
          if ( s.moved_to_cb ) s.moved_to_cb(x,y);
      }
      s.drag_stop=drag_stop;

      function moveby(tx,ty) {
        drag_start();
        drag_move(tx,ty);
        drag_stop();
      }

    function do_hide() {}


      function hide (){
        //destinations.hide();
        //sources.hide();
        bs.hide();
      }

      function show (){
          //destinations.show();
          //sources.show();

          bs.show();
      }

      if (draggable) {
        s.drag(drag_move,drag_start,drag_stop)
      }

      s.redraw = function() {
        // Yuck!
        sx = x; sy = y;
        moveby(-x,-y);
        var tr = s.attr('transform');
//        s.attr('transform','T0,0');
        t.attr('x',(t.attr('x')-5));
        t.attr('text',".\n--"+text+"--\n.");
        c = cardinalize(t).card;
        t.attr('text',text);
        r.attr({'path':path(c)});
        cardinalize(s.body);
        t.attr('x',(t.attr('x')+5));
//        s.attr('transform',tr);
        redraw_srcdst();
        moveby(sx,sy)
      }

      s.set_text = function(tx) {
        text = tx;
        s.redraw();
      };

      s.get_text = function() { return text; };

      s._remove = s.remove;

      s.remove = function () {
        children.forEach(function(c){c.remove();});
        s.push(destinations);
        s.push(sources);
        s.joint_remove()
        s._remove();
      }

      function redraw_btns() {
        for (var i in btns) {
          var b = btns[i];
          b.attr({x:15*i,y:r.card.y+2});
        }
      }

      s.addCtxBtn = function(name,image,cbg) {
        var b = paper.image(image,0,0,16,16);
        b.cbg = cbg;
        b.name = name;

        b.click(function(){
          var cb = b.cbg(s);
          return function () { try {
            cb();
          } catch(e){ console.log("btb_cb_ex:",b.name,e); }
        }}());

        b.hide();
        bs.push(b);
        btns.push(b);

        redraw_btns();
      }

      t.attr({"font-size":12,"text-anchor":"start"});

      var tshow = false;

      function toggle_toolbox() {
        if (tshow) {
          hide();
          tshow = false;
        } else {
          show();
          tshow =true;
        }
      }

      s.dblclick(toggle_toolbox);
      s.del = s.remove;


      t.toFront();
      bs.toFront();
      sources.toFront();
      destinations.toFront();

//      moveby(50,50);
     s.moveby = moveby;

       hide();
      return s;
    }


    ds.newElem = new_elem;

    return ds;
}
