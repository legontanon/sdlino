/* SDLino.js
 * Main Application Code
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

ZC = function () {
var sys = {
   name:"Untitled",
   desc:"desc...",
   sigt:{},
};

    BeforeUnLoad = function(){
      if (!saved) {
        alert("Not Saved");
        return false;
      }
      return true;
    }

    var procdef_POM_keys = {
      'name':true,
      'types':{
        'name':true,
        'src':true,
        'ref':true,
      }
      'vars':{
        'name':true,
        'type':true,
        'desc':true,
      },
      'procds':{
        'name':true,
        'src':true,
        'ref':true
      },
      'ports':{
        'name':true,
        'dir':true,
        'sig_name':true
      },
      'elem':{
        'what':true,
        'name':true,
        'next':true,
        'expr':true,
        'args':true,
      }
      'waitpoints':{
        'name':true,
        'next':true,
      }
    }









    var left = document.getElementById("Tree");
    var la = [];
    var li=0;

    function li_html(id,txt,icon,cb) {
      console.log(id,txt,icon,cb)
      return "<tr><td>"
        + ( cb ? "<a href='#' id='Li_"+id+"' onClick='ZC.LeftClick("+ id+")'>":'')
        + ( icon ?  ("<img src="+icon+">") : '')
        + txt+ "</a></td></tr>";
    }

    function left_redraw() {
      var html = '';

      for (var i in la) {
        item = la[i];
        html += li_html(i,item.txt,item.icon,item.cb);
      }

      left.innerHTML = html;
    }

    function left_clr() {
      la = [];
      li = 0;
      left_redraw();
    }

    function left_add(txt,icon,cb) {
      la[li++]={'txt':txt,'cb':cb,'icon':icon};
      left_redraw();
    }

    function left_click(id) {
      console.log(id,la[id].txt);
      try { la[id].cb(); } catch (e) { console.log("dlg_cb_ex:",e)};
      return false;
    }

    sys.LeftClick = left_click; // EXPORT

    function leftRemove(id) {
      delete la[id];
      left_redraw();
    }

    function make_path(n,a) {
      var arr = a || [];
      if (n.parent) make_path(n.parent,arr);
      arr.push(n);

      return arr;
    }


    function set_tree_view(node) {
        left_clr();
        var path = sys.path = make_path(node);
        var path_cell = document.getElementById("Path");
        sys.PathClick = function(id) {
          try { path[id].cb(path[id]); } catch(e) { console.log("path_cb_ex:",e); }
          return false;
        }
        var html = '';
        for (var i in path) {
          html += "<a href='#' onclick='ZC.PathClick(" + i + ")' >" + path[i].name + "</a>  "
        }

        path_cell.innerHTML = html;

        for (var i in node.children) {
          var n = node.children[i];
          var ncb = n.cb;
          var cb;

          if (n.cb) {
            cb = function() {
              var C = ncb;
              var N = n;
              return function () {
                try { C && C(N); } catch (e){ console.log("tree_cb_Ex:",e); }
              };
            }();
          } else {
              cb = undefined;
          }
          left_add(n.text,n.icon,cb);
        }
    }

    function parentize(n,p) {
      for (var i in n.children) {
        parentize(n.children[i],n);
      }
      p && n && ( n.parent = p);
      return n;
    }

    function lognode(i){console.log(i.name)}











    // Graphics
    //
    //
    //
    //



    function edit_txt_dlg_cbg (s) { return function(){
     new HtmlTxtBox("Dlg","Edit "+s.name+"",function(txt){
       s.set_text(txt);
       s.reDraw();
     },s.get_text());
    }}

    function delete_elem_dlg_cbg (s) {return function(){
     new HtmlDlg("Dlg","Delete "+s.name+"?",function(){
       s.del();
     },[],[]);
    }}

    var base_comments = {};

    var comments = base_comments;

    sys.comments = base_comments;

    function new_comment(text,x,y) {
     var e = new_elem("comment",text,comment_path,[
       ctxBtn('edit',"icn/edit.png",edit_txt_dlg_cbg),
       ctxBtn('delete',"icn/trash.png",delete_elem_dlg_cbg)],true);
       comments[e.comment_id = uuid()] = e;
       e.del = function() { e.remove(); delete comments[e.comment_id]; }
    }

     var signals = {};
     var sig_types = ["integer","string"];


     function edit_sig_dlg_cbg (s) { return function(){
       new HtmlDlg("Dlg","Edit Signal",function(params){
         s.name = params.name;
         s.sig_type = params.type;
         s.desc = params.desc;

         s.set_text(params.name);
         s.reDraw();
       },["name","desc","type"],[s.name,s.desc,sig_types]); // TODO sig
     }}

    function new_signal(name,desc,type,x,y) {
      var e = new_elem("signal "+name,name,output_path,[
        ctxBtn('edit',"icn/edit.png",edit_sig_dlg_cbg),
        ctxBtn('delete',"icn/trash.png",delete_elem_dlg_cbg)],true);
        signals[e.sig_id = uuid()] = e;
        e.del = function() { e.remove(); delete signals[e.sig_id]; }
    }



    function edit_state_dlg_cbg (s) { return function(){
      new HtmlDlg("Dlg","Edit State",function(params){
        s.name = params.name;
        s.desc = params.desc;

        s.set_text(params.name);
        s.reDraw();
      },["name","desc"],[s.name,s.desc]);
    }}


    function new_state(name,desc,x,y) {
      var e = new_elem("state "+name,name,state_path,[
        ctxBtn('edit',"icn/edit.png",edit_state_dlg_cbg),
        ctxBtn('delete',"icn/trash.png",delete_elem_dlg_cbg)],true);
        signals[e.sig_id = uuid()] = e;
        e.del = function() { e.remove(); delete signals[e.sig_id]; }
    }

    var assigns = {};

    function edit_assign_dlg_cbg (s) { return function(){
      new HtmlDlg("Dlg","Edit State",function(params){
        s.varname = params.varname;
        s.expr = params.expr;

        s.set_text(params.varname);
        s.reDraw();
      },["varname","expr"],[s.varname,s.expr]);
    }}


    function new_assign(V) {
      var e = new_elem("assignment "+V.name,V.name +" = "+ V.expr,box_path,[
        ctxBtn('edit',"icn/edit.png",edit_assign_dlg_cbg),
        ctxBtn('delete',
               "icn/trash.png",
               delete_elem_dlg_cbg)],
               true,
               [["A","S",function(o){
                 console.log(o);
               }]],
               [["A","N"]]);
        assigns[e.assign_id = uuid()] = e;
        e.del = function() { e.remove(); delete assigns[e.sig_id]; }
    }












    function sys_rename_cb(params){ name_text.attr("text",sys.name = params.sys_name); }
    function sys_desc_cb(text){ desc_txt.attr("text",sys.desc = text); }

    function sys_add_sigt_cb(params){
      new_signal(params.name, params.desc, params.type,0,0);
    }

    function sys_add_state_cb(params){
      new_state(params.name, params.desc, 0,0);
    }

    function sys_add_assign_cb(params){
      new_assign(params);
    }

    var ci = 0;
    function add_cmt(t) {
      new_comment(t,50,50);
    }

    function rename_dlg(){dlg("Set System Name",sys_rename_cb,["sys_name"],[sys.name]);}
    function add_sigt_dlg(){dlg("Add Signal Type",sys_add_sigt_cb,["name","desc",'type'],['name','',sig_types]);}
    function add_state_dlg(){dlg("Add State",sys_add_state_cb,["name","desc"],['name','']);}
    function add_assign_dlg(){dlg("Add Assignment",sys_add_assign_cb,["name","expr"],['name','']);}
    function set_desc_dlg(){txt_dlg("Set Description",sys_desc_cb,sys.desc);}
    function add_cmt_dlg(){txt_dlg("Add Comment",add_cmt,"text...");}

    function new_procdef_editor_cbg(pd) { function () {
      function pd_children() {
          var children = [
              {
                 name: 'cmt',
                 text: 'Add Comment',
                 icon: 'icn/comment.png',
                 cb: add_cmt_dlg,
              },
              {
                 name: 'cmt',
                 text: 'Add Variable',
                 icon: 'icn/var.png',
                 cb: add_var_dlg,
              },
              {
                 name: 'cmt',
                 text: 'Add Port',
                 icon: 'icn/var.png',
                 cb: add_var_dlg,
              },
              {
                 name: 'cmt',
                 text: 'Add Proc',
                 icon: 'icn/var.png',
                 cb: add_var_dlg,
              },
              {
                 name: 'cmt',
                 text: 'Add State',
                 icon: 'icn/flag.png',
                 cb: add_var_dlg,
              },
          ];

          children.push({ name: '-', text: '<hr><h3> Assign </h3>'});

          pd.vars = pd.vars || {};
          for (var i in pd.vars) {
              var v = vars[i];

              children.push({
                  name:v.name,
                  text:"Assign "+v.name,
                  icon: 'icn/var.png',
                  cb: add_var(v)
              })
          }

          children.push({ name: '-', text: '<hr><h3> Signals </h3>'});

          for (var i in pd.ports) {
              var p = pd.ports[i];

              children.push({
                  name: p.sig_name,
                  text  ((p.dir == 'input') ? 'In:':"Out:" )+  p.sig_name,
                  icon: (p.dir == 'input') ? 'icn/input.png':"icn/output/png",
                  cb: add_sig_cbg(p)
              });

          }

          children.push({ name: '-', text: '<hr><h3> Procedures </h3>'});

          for (var i in pd.procs) {
              var p = pd.procs[i];

              children.push({
                  name: p.name,
                  text  ((p.dir == 'input') ? 'In:':"Out:" )+  p.name,
                  icon: (p.dir == 'input') ? 'icn/input.png':"icn/output/png",
                  cb: add_sig_cbg(p)
              });

          }

          return children;
      }


      var tree = {
        name:'ProcDef:'+name,
        cb: set_tree_view,
        children : pd_children();
      }

      function add_var(V) {
          new_assing(V.varname,V.expr)
      }


      parentize(tree);

      return pd;
    }();}

    var tree = { name:'ProcDef', cb: set_tree_view, children :[
      {
         name: 'doc',
         text: 'Documentation',
         icon: 'icn/library.png',
         cb: set_tree_view,
         children: [
            {
               name: 'intro',
               text: 'Introduction',
               cb: lognode,
            },
            {
               name: 'tutorial',
               text: 'Tutorial',
               cb: set_tree_view,
               children: [
                  {name:'tut_new',cb:lognode,text:"New Project"},
                  {name:'tut_run',cb:lognode,text:"Compile Project"},
               ],
            },
            {
               name: 'Reference',
               text: 'Ref',
               cb: lognode,
            },
         ],
      },
      {
         name: 'cmt',
         text: 'Add Comment',
         icon: 'icn/comment.png',
         cb: add_cmt_dlg,
      },
      {
        name: 'sig',
        text: 'Add Output',
        icon: 'icn/milestone.png',
        cb: add_sigt_dlg,
      },
      {
        name:'-',
        text:"<HR>",
        cb:nop,
      },
      {
        name: 'sig',
        text: 'Add State',
        icon: 'icn/flag.png',
        cb: add_state_dlg,
      },
      {
        name: 'ass',
        text: 'Add Assignment',
        icon: 'icn/flag.png',
        cb: add_assign_dlg,
      },
    ]};

    try {
      set_tree_view(tree);
    } catch (e) {
      console.log("ex_start:",e);
    }
