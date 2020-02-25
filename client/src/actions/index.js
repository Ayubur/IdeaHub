import {AUTH_USER,AUTH_ERROR,INTERNAL_ERROR,REMOVE_ERROR,AUTH_LOGOUT} from './types';
import axiosConfig from '../axiosConfig';

export const register= (formData, callback)=> async dispatch =>{
    try{
        const response = await axiosConfig.post("/register", formData);
        if( response.data.code==400&&response.data.message){
                    dispatch({
                        type: AUTH_ERROR,
                        payload: response.data.message
                    });
        }else{
                dispatch({
                        type: AUTH_USER,
                        payload: response.data
                });
                
                localStorage.removeItem('state');
                localStorage.setItem('state',response.data.token);

                callback();
        }



    }catch(e){
        dispatch({type:INTERNAL_ERROR, payload:"Internal Server Problem"});
    }
}



export const login= (formData, callback)=> async dispatch =>{
    try{
        const response = await axiosConfig.post("/login", formData);
        if( response.data.code==400 && response.data.message){
                    dispatch({
                        type: AUTH_ERROR,
                        payload: response.data.message
                    });
        }else{
                dispatch({
                        type: AUTH_USER,
                        payload: response.data
                });
                
               localStorage.removeItem('state');
               localStorage.setItem('state',response.data.token);

                callback();
        }



    }catch(e){
        dispatch({type:INTERNAL_ERROR, payload:"Internal Server Problem"});
    }
}


export const signout = ()=> dispatch=>{
    localStorage.removeItem('state');
    dispatch({
        type: AUTH_LOGOUT,
        payload:null
    })
}

export const removeError=()=> dispatch=>{
            dispatch({
                type: REMOVE_ERROR,
                payload:""
        });
}



