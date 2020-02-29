import {IDEA_CREATE,IDEA_ERROR,REMOVE_ERROR} from '../actions/types';

const INITIAL_STATE={
        idea:null,
        error:""
}

const idea =(state=INITIAL_STATE, actions)=>{
    switch(actions.type){
        case IDEA_CREATE:
            return {...state, idea:actions.payload, error:""};
        case IDEA_ERROR:
            return {...state, error:actions.payload};
        case REMOVE_ERROR:
            return {...state,error:actions.payload};
        default:
            return {...state};
    }
}

export default idea;