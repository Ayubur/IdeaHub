import {AUTH_USER,AUTH_ERROR,INTERNAL_ERROR,REMOVE_ERROR,AUTH_LOGOUT,IDEA_CREATE, IDEA_ERROR} from './types';
import axiosConfig from '../axiosConfig';

export const register= (formData, callback)=> async dispatch =>{
    try{
        const response = await axiosConfig.post("/register", formData);
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
                localStorage.setItem('state',JSON.stringify(response.data));

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
                localStorage.setItem('state',JSON.stringify(response.data));

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

export const createIdea=(formData,token,callback)=> async dispatch =>{

    try{
        const response = await axiosConfig.post("/api/ideas", formData,{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        if(response.data.code==400 || response.data.code==403 || response.data.message){
                    dispatch({
                        type: IDEA_ERROR,
                        payload: response.data.message
                    });
        }else{
                dispatch({
                        type: IDEA_CREATE,
                        payload: response.data
                });

                callback();
        }

    }catch(e){
        dispatch({type:INTERNAL_ERROR, payload:"Internal Server Problem"});
    }
         
}



export const updateIdea=(formData,token,ideaId,callback)=> async dispatch =>{

    try{
        const response = await axiosConfig.patch(`/api/ideas/${ideaId}`, formData,{
            headers:{
                authorization: `Bearer ${token}`
            }
        });

        if(response.data.code==400 || response.data.code==403 || response.data.message){
                    dispatch({
                        type: IDEA_ERROR,
                        payload: response.data.message
                    });
        }else{
                dispatch({
                        type: IDEA_CREATE,
                        payload: response.data
                });

                callback();
        }

    }catch(e){
        dispatch({type:INTERNAL_ERROR, payload:"Internal Server Problem"});
    }
         
}



export const removeError=()=> dispatch=>{
            dispatch({
                type: REMOVE_ERROR,
                payload:""
        });
}
