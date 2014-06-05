///Header
/* SDLino generated spagetti code
 *
 *
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
#include "sdlino.h"

///StructTypeHead
typedef struct _sdlino_type_{{type_name}}_t {
///StructTypeItem
    {{item_type}} {{item_name}}{{item_card}};
///StructTypeTail
} sdlino_type_{{type_name}}_t;

///SignalDataHead
typedef struct _sdlino_sig_{{type_name}}_t {
///StructDataItem
{{item_type}} {{item_name}}{{item_card}};
///StructDataTail
} sdlino_type_{{type_name}}_t;

///ProcessDataHead
typedef struct _sdlino_process_{{process_name}}_t {
///ProcessDataItem
   {{item_type}} {{item_name}}{{item_card}};
///ProcessDataTail
} sdlino_process_{{process_name}}_t;


///ProcessFnHead
sdlino_wait_id_t sdlino_process_{{process_name}}(
      sdlino_wait_id_t wait,
      sdlino_signal_t* sig,
      sdlino_process_t* proc) {

      sdlino_process_{{process_name}}_t* data = proc->data;

///ProcessProcDecl
     sdlino_procedure_{{procedure_name}}_t {{procedure_name}}_data;

///Process
  switch(wait) {
    case SDLINO_WAIT_START:
      memset(data,1,sizeof(sdlino_process_{{process_name}}_t));
      goto initial_state:

///ProcessWaitHead
    case {{wait_id}}:
      switch(sig->id) {
        case SDLINO_SIG_KILL:
          D(("Process %d Killed"))
          return SDLINO_PROCESS_DEAD;

///ProcessWaitSignal
        case {{signal_id}}:
          goto {{target_id}};

///ProcessWaitTail
        default:
          return SDLINO_UNEXPECTED_SIGNAL;
        } /* switch(sig->id) */

///IntoStateItem
          {{state_name}}: D(("%d: => %s",proc->id,"{{state_name}}"));
          goto {{dst_target_id}};

///GoToStateItem
          {{target_id}}: proc->state = {{state_id}}; goto {{state_name}};

///CondItem
          {{target_id}}: if ( {{condition}} ) goto {{true_target_id}}; else goto {{false_target_id}};

///VarAssignmentItem
          {{target_id}}: data.{{varname}} = ({{expr}}); goto {{target_id}};

///OutputItem
          {{target_id}}: sdlino_send_sig(proc,{{signal_id}},{{sig_params}}); return {{target_wait}};

///ProcedureCallItem
          {{target_id}}: {
            proc_data(data,1,sizeof(sdlino_procedure_{{procedure_name}}_t));
            sdlino_procedure_{{procedure_name}}({{procedure_name}}_data,{{signal_id}},{{sig_params}});
            return {{target_wait}};
          }
///ProcessFnTail
  } /* switch(wait) */
  error:
  return SDLINO_INTERNAL_ERROR;
}


///Trailer
