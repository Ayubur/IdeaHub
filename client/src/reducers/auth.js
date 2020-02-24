import {AUTH_USER, AUTH_ERROR,INTERNAL_ERROR, REMOVE_ERROR} from '../actions/types';

const INITIAL_STATE={
        user:null,
        error:""
}

const auth =(state=INITIAL_STATE, actions)=>{
    switch(actions.type){
        case AUTH_USER:
            return {...state, user:actions.payload, error:""};
        case AUTH_ERROR:
            return {...state, error:actions.payload};
        case INTERNAL_ERROR:
            return {...state,error:actions.payload};
        case REMOVE_ERROR:
            return {...state,error:actions.payload};
        default:
            return {...state};
    }
}

export default auth;