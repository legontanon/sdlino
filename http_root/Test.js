/* Test.js
 * Test Code For Modules
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

var test_system = {
  user:"test",
  host:"localhost",
  system_name:"Test",
  system_model_version="0",
  enums: {
    PinState:{0:"down",1:"up",source:"0934892-23324-42323-243", enum_name:"PinState"},
  },
  types: {
    PinEvt:{type_name:"PinEvt",source:"0934892-23324-42323-242",items: [
        {item_name:"pin",item_type:'Int'},
        {item_name:"state", item_type:'Enum', enum_id:"PinState"},
    ]},
    TimerData:{type_name:"TimerData",source:"0934892-23324-42323-243",items:[
      {item_name:"timer_id",item_type:"Int"},
      {item_name:"delay",item_type:"Int"}
    ]},
  },
  sigdefs: {
    PinUp:{sig_name:"PinUp",data_type:"PinEvt"},
    PinDn:{sig_name:"PinDn",data_type:"PinEvt"},
    TimerStart:{sig_name:"TimerStart",data_type:"TimerData"},
    TimerStop:{sig_name:"TimerStop",data_type:"TimerData"},
    TimerOut:{sig_name:"TimerOut",data_type:"TimerData"},
  },
  vars: {
    a:{var_name:"a",var_type:'Int',var_cardinality:'', var_default:"0"},
    b:{var_name:"b",var_type:'Str',var_cardinality:'', var_default:"hello!"},
    c:{var_name:"c",var_type:'Int',var_cardinality:'[10]', var_default:"[0,0,0,0,0,0,0,0,0,0]"},
  },
  procs: [
    {proc_name:"doorbell_button",pin:"D6",proc_def:"InPinCtl"},
    {proc_name:"door_sensor",pin:"D7",proc_def:"InPinCtl"},
    {proc_name:"lock_sensor",pin:"D8",proc_def:"InPinCtl"},
    {proc_name:"door_activator",pin:"D9",proc_def:"OutPinCtl"},
    {proc_name:"lock_activator",pin:"D10",proc_def:"OutPinCtl"},
    {proc_name:"lock_timer",t:400},
    {proc_name:"close_timer",t:1200},
    {proc_name:"closing_timer",t:5000},

  ],
  procdefs: {
    DoorCtl: { type:"Process", proc_name:"DoorCtl", items: {
      DoorCtl00: {target_id:"DoorCtl00", type="State",state_name="INITIAL",dst_target_id='DoorCtl01'},
      DoorCtl01: {target_id:"DoorCtl01", type="Condition",condition="a == 0",true_target_id='DoorCtl02',false_target_id='DoorCtl03'},
    }},
    InPinCtl:{type:"built_in", name:"InPinCtl", out:["PinDn","PinUp"]},
    OutPinCtl:{type:"built_in", name:"OutPinCtl", in:["PinDn","PinUp"]},
    Timer:{type:"built_in",name:"Timer", in:["TimerStart","TimerStop"], out:["TimerOut","TimerStopped"]},
  },
}

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


function FlowChart(cont,elements) {
  this.diagram = new DiagramSpace(cont);
  this.elements = elements;

  function edit_text_cbg(e) { return function() {
    new HtmlTxtBox("Dlg","Edit",function(t){ e.set_text(t); e._txt = t }, e._txt);
  }}

  function delete_elem_cbg(e) { return function() { e.remove(); } }
    //"input","input","output","procedure","cond","wait"];//,"dst","src"]

  function add_wait_joint(x){

    L( x.flowSrc.parent_element.addSrc,'Wait', x.flowSrc.pos, add_wait_joint);
    x.flowSrc.parent_element.addSrc('Wait',x.flowSrc.pos, add_wait_joint);

    x.flowDst.disable();
    x.flowDst.peer.disable();
    x.flowSrc.disable();

    return true;
  }

  this.addElem = function (o) {
    // var text = (type == 'wait')  ? ' ' : o.name;
    var e = d.newElem(o.text, o.type, true);
    e.data = o;
    e.moved_to_cb = function(x,y){ o.x= x; o.y= y; }

    e.addCtxBtn('edit',"icn/edit.png",edit_text_cbg);
    e.addCtxBtn('delete',"icn/trash.png",delete_elem_cbg);

    switch (elem.type) {
      case "cond":
        e.True = e.addSrc('Flow','E',function(x){L('T',x); return true;});
        e.False = e.addSrc('Flow','W',function(x){L('F',x); return true;});
        e.Flow = e.addDst('Flow','N');
        break;
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
    e.moveby(o.x,o.y);
    return e;
  }

  this.Els = []

  for (i in elements) {
    var elem = elements[i];
    this.Els.push(this.addElem(elem));
  }
}
//TestHtmlMenu()

function TestFlowChart() {
  var fc_s = [
    {id:"00",name:"INITIAL",type:"state",x:500,y:200,Flow:"01"},
    {id:"01",name:"CLOSED",type:"state",x:500,y:200,Wait:["02","03"]},
    {id:"02",name:"lock",type:"input",x:500,y:300,Flow:"02"},
    {id:"03",name:"open",type:"input",x:500,y:300,Flow:"04"},
    {id:"04",name:"LOCKED",type:"state",x:500,y:600,Flow:""},
    {id:"02",name:"unlock",type:"output",x:500,y:400,Flow:"03"},
    {id:"00",name:"CLOSED",type:"state",x:500,y:200,Wait:["01",""]},
    {id:"02",name:"OPENDED",type:"state",x:500,y:600,Flow:""},
    {id:"04",name:"close",type:"input",x:500,y:600,Flow:"06"},
  ]

  try {
      var f = FlowChart("Main",fc_s);
  } catch(er) {
    L(er);
  }

}

function TestPastaMatic() { try {
  var o = {};

  function cb(text) {
    o.p = new PastaMatic(test_system,new Template(text))
    o.out = o.p.compile();
  }

  var r = new RemoteFile("runtime/arduino/template.c",cb);
  return o;
} catch(e) {L(e);} }

t = TestPastaMatic();
L(t);

//TestFlowChart();
