/* Test.js
 * Test Code For Modules
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


function TestHtmlDlg() { // TODO get it to work this way...
  try {
    var d = new HtmlDlg("Dlg",
                        "title",
                        L,
                        ["text","more_text","even_more_text","number","boolean","choice","more_choice"],
                        ["Just Text","Just Text again","More Text","A Number","A boolean","A List","The same list"],
                        {
                          text:"default",
                          more_text:function(){return "default2"},
                          //even_more_text:"defaults to text",
                          number:1,
                          boolean: true,
                          choice:{"Option Name":"value","Option Name2":"value2"},
                          more_choice:function(){ return {"Option Name":"value","Option Name2":"value2"} },
                        });
  } catch(e) {
    L(e);
  }
}


function TestHtmlTxtBox() {
  try {
    var d = new HtmlTxtBox("Dlg",
                        "title",
                        L,
                        "text..\nmore text.");
  } catch(e) {
    L(e);
  }
}

function TestHtmlMenu() {
  try {
    var d = new HtmlMenu("Dlg",
                        "title",
                        [
                          {name:"dia",text:"Test HtmlDlg",cb:TestHtmlDlg},
                          {name:"txt",text:"Test HtmlTxtBox",cb:TestHtmlTxtBox},
                        ]);
  } catch(e) {
    L(e);
  }
}


function TestDiagramSpace() {
  function edit_text_cbg(e) { return function() {
    new HtmlTxtBox("Dlg","Edit",function(t){ e.set_text(t); e._txt = t }, e._txt);
  }}

  function delete_elem_cbg(e) { return function() { e.remove(); } }
  var ps = [
{id:"00",name:"INITIAL",type:"state",x:500,y:200,next:"01"},
{id:"01",name:"unlock",type:"output",x:500,y:400,next:"02"},
{id:"02",name:"start_timer",type:"output",x:500,y:400,next:"03"},
{id:"03",name:"STARTING",type:"state",x:500,y:300,next:"03"},
//{id:"04",name:undefined,input_ids:[""]},
{id:"05",name:"locked",type:"input"},
{id:"06",name:"t1_out",type:"input"},
{id:"07",name:"FAILED",type:"state"},
{id:"03",name:"STARTING",type:"state",x:500,y:300,next:"03"},
{id:"03",name:"STARTING",type:"state",x:500,y:300,next:"03"},
{id:"02",name:"close",type:"output",x:500,y:400,next:"03"},
{name:"OPENED",type:"state"},
{name:"CLOSED",type:"state"},
{name:"LOCKED",type:"state"},
// {name:"a := a + 1",type:"box"},
{name:"get_lock_state",type:"output"},
{name:"get_door_state",type:"output"},
{name:"opened",type:"input"},
{name:"closed",type:"input"},
{name:"unlocked",type:"input"},
{name:"unlock",type:"output"},
{name:"lock",type:"output"},
{name:"open",type:"output"},
{name:"close",type:"output"},
]
    //"input","input","output","procedure","cond","wait"];//,"dst","src"]

  function new_elem(o) {
    // var text = (type == 'wait')  ? ' ' : o.name;
    var e = d.newElem(text, o.type, true);

     e.addCtxBtn('edit',"icn/edit.png",edit_text_cbg);
     e.addCtxBtn('delete',"icn/trash.png",delete_elem_cbg);

      function add_wait_joint(x){
        L( x.flowSrc.parent_element.addSrc,'Wait', x.flowSrc.pos, add_wait_joint);
        x.flowSrc.parent_element.addSrc('Wait',x.flowSrc.pos, add_wait_joint);


        x.flowDst.disable();
        x.flowDst.peer.disable();
        x.flowSrc.disable();

        return true;
      }

     switch (type) {
       case "cond":
         e.addSrc('Flow','E',function(x){L('T',x); return true;});
         e.addSrc('Flow','W',function(x){L('F',x); return true;});
         e.addDst('Flow','N');
         break;
      //  case "wait":
      //    e.addSrc('Wait','W',add_wait_joint);
      //    e.addDst('Flow','N');
      //    e.label.hide();
      //    e.body.attr('fill','black');
      //    break;
       case "input":
          e.addSrc('Flow','S',function(x){L(x); return true;});
          var d1 = e.addDst('Wait','N',add_wait_joint);
          var d2 = e.addDst('Flow','N',add_wait_joint);
          d1.peer = d2;
          d2.peer = d1;
         break;
       default:
         e.addSrc('Flow','S',function(x){L('F',x); return true;});
         e.addDst('Flow','N');
         break;

     }

    e._txt=text;

    e.moveby((i%8)*100+50,(1+Math.floor(i/8))*100);
  }

  try {
    var d = DiagramSpace("Main");
    var els = {}
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      new_elem(p.name,p.type);

    }
  } catch(er) {
    L(er);
  }

}
//TestHtmlMenu()
TestDiagramSpace();
