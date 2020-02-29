import {combineReducers} from 'redux';
import auth from './auth';
import idea from './idea';

export default combineReducers({
    auth:auth,
    idea:idea
})