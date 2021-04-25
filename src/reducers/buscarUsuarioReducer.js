import {BUSCAR_USUARIO} from '../actions/types';


const initialState = {};

export default function(state = initialState, action) {
    switch(action.type){
         case BUSCAR_USUARIO: 
            return {
               ...state,
               nombres: action.usuario.nombres,
               apellidos: action.usuario.apellidos,
               carrera: action.usuario.carrera,
               codigo: action.usuario.codigo 
            }
        default:
            return state;
    }
}