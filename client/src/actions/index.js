import {AUTH_USER,AUTH_ERROR,INTERNAL_ERROR,REMOVE_ERROR} from './types';
import axiosConfig from '../axiosConfig';

export const register= (formData, callback)=> async dispatch =>{
    try{
        const response = await axiosConfig.post("/register", formData);
        if(response.data.message){
                    dispatch({
                        type: AUTH_ERROR,
                        payload: response.data.message
                    });
        }else{
                dispatch({
                        type: AUTH_USER,
                        payload: response.data
                });

                const state ={
                    user: response.data.token,
                    error:''
                  };
                localStorage.removeItem('state');
                localStorage.setItem('state',state);

                callback();
        }



    }catch(e){
        dispatch({type:INTERNAL_ERROR, payload:"Internal Server Problem"});
    }
}

export const removeError=()=> dispatch=>{
            dispatch({
                type: AUTH_USER,
                payload:""
        });
}