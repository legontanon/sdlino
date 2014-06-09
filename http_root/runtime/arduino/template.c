 /* template.c
  * SDLino - An SDL implementation for Arduino
  * Template for the arduino target code.
  *
  * (c) 2014 Luis Enrique Garcia Ontañon <luis@ontanon.org>
 */
///Head
/* SDLino generated spaghetti code
 * for {{system_name}}
 * on {{timestamp}} by {{user}} at {{host}}
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
///TypeDefHead
struct _{{type_name}}_T {
///TypeDefItem
    {{item_type}}_T {{item_name}}{{item_card}};
///TypeDefFoot
};

///ProcDeclHead
sdlino_wait_id_t P_{{proc_name}}( sdlino_wait_id_t, sdlino_signal_t*, sdlino_process_t*);
typedef struct _{{proc_name}}_P {
///ProcDeclItem
    {{var_type}}_T {{var_name}}{{var_cardinality}};
///ProcDeclFoot
} {{proc_name}}_P;

///ProcessDefHead
sdlino_wait_id_t sdlino_process_{{process_name}}(
      sdlino_wait_id_t wait,
      sdlino_signal_t* sig,
      sdlino_process_t* proc) {

      {{proc_name}}_P* data = ({{proc_name}}_P*)proc->data;

  switch(wait) {
    case SDLINO_WAIT_START:
      goto initial_state:
///WaitHead
    case {{wait_id}}:
      switch(sig->id) {
        case SDLINO_SIG_KILL:
          D(("Process %d Killed"))
          return SDLINO_PROCESS_DEAD;

///WaitItem
        case {{signal_id}}:
          goto {{dst_target_id}};

///WaitFoot
        default:
          return SDLINO_UNEXPECTED_SIGNAL;
        } /* switch(sig->id) */

///State
          {{state_name}}: {{target_id}}:
          SDLinoDebug((DEBUG_STATE,0,"%d: => %s",proc->id,"{{state_name}}"));
          goto {{dst_target_id}};

///GoToState
          {{target_id}}: goto {{state_name}};

///Condition
          {{target_id}}: if ( {{condition}} ) goto {{true_target_id}}; else goto {{false_target_id}};

///VarAssignment
          {{target_id}}: data.{{var_name}} = ({{c_expr}}); goto {{dst_target_id}};

///Output
          {{target_id}}: sdlino_send_sig(proc,{{signal_id}},{{sig_params}}); return {{target_wait}};

///ProcCall
          {{target_id}}: {
            // TODO
          }
///ProcCallReturn

///ProcDefFoot
  } /* switch(wait) */
  error:
  return SDLINO_INTERNAL_ERROR;
}


///Foot
/*EOF*/
///Eof
