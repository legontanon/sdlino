/*START*/
///^
//: TypeDecl+ EnumDef+ TypeDef+ ProcDecl+ ProcDef+ ProcVarInst+ ProcInst+ MainCode
/* SDLino generated spaghetti code for system: {{system_name}}
 * by {{user}} at {{host}} on {{timestamp}}
 *
 * {{copyright}}
 *
 * SDLino - An SDL implementation for Arduino
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
#include "sdlino.h"

///TypeDecl
typedef struct _{{type_name}}_T {{type_name}}_T;

///EnumDef:^
//: EnumItem+
typedef enum _{{enum_name}}_T {
///EnumDef:EnumItem
  {{enum_name}}_{{item_name}}={{item_value}},
///EnumDef:EnumItemNoVal
  {{enum_name}}_{{item_name}},
///EnumDef:$
} {{enum_name}}_T;

///TypeDef:^
//: TypeItem+
struct _{{type_name}}_T {
///TypeDef:TypeItem
    {{item_type}}_T {{item_name}}{{item_card}};
///TypeDef:$
};

///ProcDecl:^
//: ProcDeclVar+
sdlino_wait_id_t P_{{proc_name}}( sdlino_wait_id_t, sdlino_signal_t*, sdlino_process_t*);
typedef struct _{{proc_name}}_P {
///ProcDecl:ProcDeclVar
    {{var_type}}_T {{var_name}}{{var_cardinality}};
///ProcDecl:$
} {{proc_name}}_P;

///ProcDef:^
//=ProcDefItem { IntoWait State GotoState Condition VarSet Output }
//: Wait+ ProcDefItem+
sdlino_wait_id_t sdlino_process_{{process_name}}(
      sdlino_signal_t* sig,
      sdlino_process_t* proc) {
      int waiting_for;

      {{proc_name}}_P* data = ({{proc_name}}_P*)proc->data;

    if(sig) {
      if((sig->id & SDLINO_SIG_PROC_RET) == SDLINO_SIG_PROC_RET) {
        waiting_for = (sdlino_call_ret_sig_t*)(sig->data)->proc_id;
      } else {
        waiting_for = sig->id;
      }
    }

  switch(proc->wait) {
    case SDLINO_WAIT_START:
      goto INITIAL:
///ProcDef:Wait:^
//: Signal+ Returnmm'[5432§§§§]+
    case {{wait_id}}:
      switch(waiting_for) {
        case SDLINO_SIG_KILL:
          SDLINO_DEBUG((DEBUG_PROC,0,"Shouldn't happen!"));
          D(("Process %d Killed"))
          return SDLINO_PROCESS_DEAD;

///ProcDef:Wait:Signal
        case SDLINO_SIG_ID({{signal_id}}):
          goto {{dst_target_id}};

///ProcDef:Wait:Return
        case SDLINO_PROC_ID({{proc_id}}):
          goto {{dst_target_id}};

///ProcDef:Wait:$
        default:
          return SDLINO_UNEXPECTED_SIGNAL;
        } /* switch(waiting_for) */

        SDLINO_DEBUG((DEBUG_PROC,0,"Shouldn't happen!"));
        goto error;

///ProcDef:IntoWait:^
        {{target_id}}:
          SDLINO_WAIT_INIT({{wait_id}});
///ProcDef:IntoWait:WaitInput
          SDLINO_WAIT_INPUT({{wait_id}},{{signal_id}});
          return proc->wait;

///ProcDef:State
          {{state_name}}: {{target_id}}:
            SDLINO_DEBUG((DEBUG_STATE,1," %d => {{state_id}}",proc->state));
            proc->state = {{state_id}};
            goto {{dst_target_id}};
///ProcDef:GoToState
          {{target_id}}: goto {{state_name}};

///ProcDef:Condition
          {{target_id}}: if ( {{condition}} ) goto {{true_target_id}}; else goto {{false_target_id}};

///ProcDef:VarSet
          {{target_id}}: data.{{var_name}} = ({{expr}}); goto {{dst_target_id}};

///ProcDef:Output:^
//: OutParam+
          {{target_id}}:
            SDLINO_SIG(({{signal_id}});
///ProcDef:Output:OutParam
            SDLINO_SIG_PARAM({{signal_id}},{{param_name}},{{param_val}});
///ProcDef:Output:$
            goto {{dst_target_id}};

///ProcDef:ExtProcCall
          {{target_id}}: SDLINO_WAIT_PROC({{wait_id}}); return proc->wait;

///ProcDef:IntProcCall
          {{target_id}}: SDLINO_PUSH({{proc_id}}); goto {{proc_target_id}};
          Return_{{proc_id}}: goto {{dst_target_id}};
///ProcDef:IntProcReturn:^
//: Item+
          {{target_id}}:
            switch(SDLINO_POP({{proc_id}})) {
///ProcDef:IntProcReturn:Item
              case {{proc_id}}: goto Return_{{proc_id}};
///ProcDef:IntProcReturn:$
            SDLINO_DEBUG((DEBUG_PROC,0,"returning bad!"));
            default: goto error;
            };
///ProcDef:$
  } /* switch(wait) */
  error:
  return SDLINO_INTERNAL_ERROR;
}

///ProcVarInst:^
//: PVVar+ PVArg+
{{proc_name}}_P v_{{process_id}} = {
///ProcVarInst:PVVar
    {{var_initial_value}};
///ProcVarInst:PVArg
    {{arg_value}};
///ProcVarInst:$
};

///ProcInst:^
//: Proc+
SDLinoProcInst_t processes[{{process_num}}] = {
///ProcInst:Proc
  SDLinoProcInst({{process_id}}),
///ProcInst:$
  SDLinoProcInstEnd
};

///MainCode:^
//: SetupProc+
setup() {
  SDLinoInit();

///MainCode:SetupProc
  SDLINO_PROC_SETUP({{process_id}});

///MainCode:$
}

loop() {
  SDLinoLoop();
}

///$
