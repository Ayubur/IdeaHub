import React,{Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Ideas extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return(
         <div className="body-content">
           <div className="container">
               <p>hello</p>
           </div>
           </div>
        );
    }
}

export default Ideas;
