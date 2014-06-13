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
var test_libs = {
  ArduinoBase: {
    what:"Lib",
    name:"ArduinoBase",
    desc:"Library model example",
    version:"0.0.1",

    enums: [
      {source:"ArduinoBase", enum_name:"PinState", what:"Enum", EnumItem:[
        {enum_name:"PinState",item_name:"PIN_DOWN",item_value:0},
        {enum_name:"PinState",item_name:"PIN_UP",item_value:1},
      ]},
    ],

    types: [

      {type:"Type",type_name:"PinEvt",source:"0934892-23324-42323-242",TypeItem: [
          {type:"TypeItem",item_name:"pin",item_type:'Int'},
         {type:"TypeItem",item_name:"state", item_type:'PinStateEnum', enum_id:"PinState"},
      ]},
      {type:"Type",type_name:"TimerData",source:"0934892-23324-42323-243",TypeItem:[
        {type:"TypeItem",item_name:"timer_id",item_type:"Int"},
        {type:"TypeItem",item_name:"delay",item_type:"Int"},
        {type:"TypeItem",item_name:"var",item_type:"Int"},
      ]},
    ],

    sigdefs: {
      PinUp:{what:"SigDef",sig_name:"PinUp",data_type:"PinEvt"},
      PinDn:{what:"SigDef",sig_name:"PinDn",data_type:"PinEvt"},
      TimerStart:{what:"SigDef",sig_name:"TimerStart",data_type:"TimerData"},
      TimerStop:{what:"SigDef",sig_name:"TimerStop",data_type:"TimerData"},
      TimerOut:{what:"SigDef",sig_name:"TimerOut",data_type:"TimerData"},
    },

    procdefs: {
      InPinCtl:{what:"ProcessDef",type:"built_in", name:"InPinCtl", out:["PinDn","PinUp"]},
      OutPinCtl:{what:"ProcessDef",type:"built_in", name:"OutPinCtl", in:["PinDn","PinUp"]},
      Timer:{what:"ProcessDef",type:"built_in",name:"Timer", in:["TimerStart","TimerStop"], out:["TimerOut","TimerStopped"]},
      Serial:{what:"ProcedureDef",type:"built_in"}
    },
  },
};

var test_system = {
  desc:"Data Model Example",
  what:"System",
  user:"test",
  host:"localhost",
  system_name:"Test",
  system_model_version:"0.0.1",
  libs: test_libs,
  procs: [
    {what:"Process", proc_def:"InPinCtl", proc_name:"doorbell_button", args:{pin:"D6"}},
    {what:"Process", proc_def:"InPinCtl", proc_name:"door_sensor", args:{pin:"D7"}},
    {what:"Process", proc_def:"InPinCtl", proc_name:"lock_sensor", args:{pin:"D8"}},
    {what:"Process", proc_def:"OutPinCtl", proc_name:"door_activator", args:{pin:"D9"}},
    {what:"Process", proc_def:"OutPinCtl", proc_name:"lock_activator", args:{pin:"D10"}},
    {what:"Process", proc_name:"lock_timer",args:{t:400,var:0}},
    {what:"Process", proc_name:"close_timer",args:{t:1200,var:0}},
    {what:"Process", proc_name:"closing_timer",args:{t:5000,var:0}},
  ],
  procdefs:[
    { what:"ProcDef", type:"Process", proc_name:"DoorCtl", ProcDeclVar: [
        {what:"VarDecl", var_name:"a",var_type:'Int', var_default:"0"},
        {what:"VarDecl", var_name:"b",var_type:'Str', var_default:"hello!"},
        {what:"VarDecl", var_name:"c",var_type:'Int',var_cardinality:'[10]', var_default:"[0,0,0,0,0,0,0,0,0,0]"},
      ], ProcDefItem: [
        {what:"State",state_name:"INITIAL",pos:{x:500,y:200},state_id:0,dst_target_id:'DoorCtl01'},
        {target_id:"DoorCtl01", what:"Condition",condition:"a == 0",pos:{x:500,y:300},true_target_id:'DoorCtl02',false_target_id:'DoorCtl03'},
        {target_id:"DoorCtl03", what:"Output",signal_id:"TimerStart",pos:{x:700,y:400},dst_target_id:'DoorCtl04',OutParam:[
          {signal_id:1,param_name:"timer_id",param_val:"1"},
          {signal_id:1,param_name:"delay",param_val:"1000"},
          {signal_id:1,param_name:"var",param_val:"10"},
        ]},
        {target_id:"DoorCtl04", what:"VarSet",var_name:"a",expr:"1",pos:{x:300,y:400},dst_target_id:'DoorCtl05'},
        {target_id:"DoorCtl05", what:"IntoWait",wait_id:"wDoorCtl01",pos:{x:300,y:400}},
        {wait_id:"wDoorCtl01",what:"Wait",SigRet:[
          {what:"Signal",pos:{x:300,y:400},signal_id:"PinUp",dst_target_id:"DoorCtl07"},
          {what:"Return",pos:{x:300,y:400},proc_id:"Procd01",dst_target_id:"DoorCtl08"},
          //{what:"Return",pos:{x:300,y:400}},signal_id:"",dst_target_id:""},
        ]},
        {target_id:"DoorCtl07",what:"GoToState",state_name:"STATE2"},
        {target_id:"DoorCtl07",what:"State",state_name:"STATE2",state_id:1,pos:{x:500,y:200},dst_target_id:'DoorCtl01'},
      ],
    },
  ],
};



Elem.prototype.add_joint = function(joint_name, elem2) {
  var js = this.joints[joint_name] = this.joints[joint_name] || []
  var js2 = elem2.joints[joint_name] = elem2.joints[joint_name] || []
  me.add("dst_target_id",e.target_id);
  js.push(elem2);
  js2.push(this);
}

Elem.prototype.remove_joint = function(joint_name,elem2) {
  var js = this.joints[joint_name];
  var js2 = elem2.joints[joint_name];

  js2.exclude(this);
  js.exclude(elem2);
}

Elem.prototype.clean = function() {
  var o = {};
  this.Memers.forEach(function(e){ o[e] = this[e]; });
  return o;
}

function Elem(fc,pos) {
  this.pos = pos;
  this.joints = {};
  this.fc = fc;

  return this;
}

Elem.prototype.add(name,val) {
  this.Members.push(name);
  this[name]=val;
}

Elem.prototype.add_target() {
  this.Members.push("target_id");
  this.target_id = this.fc.get_next_target_id();
}

function State(fc, name,pos) {
    me = new Elem(fc, pos);
    me.add("state_name",name);
    me.add_target();
    me.Members = ["state_name","target_id","dst_target_id"];
    return me;
}


function ProcDef(name) {
  var me = this || {};
  me.vars = []
  me.elems = []
  me.next_target_id = 0;



  me.add_var = function(name,type,dflt) { me.vars.push({
      var_name:name, var_type:type, var_default:dflt
    });}

  me.add_elem = function(elem) { me.elems.push(elem.clone());}


  me.conf = function() {
    var o = {};
    var vs = clone(me.vars);
    var es = clone(me.elems);

    for( var i in vs ) {
      var v = vs[i];
      v.what = "VarDecl";

    }

    o.ProcVar = o.ProcDeclVar = vs;

    o.ProcDefItem = es ;
  }
}

function reitemize_procs(ps) {
  ps = clone(ps);

  for (var pi in ps) {
    var items = p.items;

    for (var i in items) {
      item = items[i];

      if ( item.what in p ) {
        p[item.type].push(item);
      } else {
        p[item.type] = [item];
      }
    }
  }
  return ps;
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

FlowChart.prototype

function FlowChart(cont,elements) {
  this.diagram = new DiagramSpace(cont);
  this.elements = elements;
  var next_target_id=0;

  this.get_next_target_id = function() { return next_target_id++; }

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
  ]

  try {
      var f = FlowChart("Main",fc_s);
  } catch(er) {
    L(er);
  }

}


var Tsys = {
  desc:"Data Model Example",
  what:"System",
  user:"test",
  host:"localhost",
  system_name:"Test",
  timestamp: (new Date()).toString(),
  type:undefined,
  EnumDef:clone(test_libs.ArduinoBase.enums),
  TypeDecl:clone(test_libs.ArduinoBase.types),
  TypeDef:clone(test_libs.ArduinoBase.types),
  ProcDecl:clone(test_system.procdefs),
  ProcDef:clone(test_system.procdefs),
}

function TestPastaMatic() { try {
  var o = {};
  var pre = document.getElementById("Pre");

  function cb(text) {
    try {
    o.t = new Template(text);
    pre.innerHTML = o.t.format(Tsys);
  } catch(e) {L(e);}
    // o.p = new PastaMatic(test_system,)
    // o.out = o.p.compile();
  }

  var r = new RemoteFile("runtime/arduino/template.c",cb);
  return o;
} catch(e) {L(e);} }

var T = TestPastaMatic();
