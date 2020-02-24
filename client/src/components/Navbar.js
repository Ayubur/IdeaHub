import React from 'react';

import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions';

 class Navbar extends React.Component{


  displayingRightNavItem(){
    if(this.props.user){
      return(
        <div className="navbar-end">
        <a href="#" className="navbar-item">
             Profile
          </a>
          <a href="#" className="navbar-item">
            Logout
          </a>
        </div>
      );
    }else{
      return(
        <div className="navbar-end">
        <a href="/login" className="navbar-item">
             Login
          </a>
          <a href="/register" className="navbar-item">
            Register
          </a>
        </div>
      );
    }
  }
    render(){
        return(
            <nav className="navbar is-fixed-top is-primary is-expanded" role="navigation" aria-label="main navigation">
                <div className="container">
            <div className="navbar-brand">
                <a href="/" className="navbar-item"><b>IdeaHub</b></a>
          
              <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>
          
            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start">
              <div className="navbar-item">
                  <div className="buttons">
                    <a className="button is-success">
                      <strong>Latest</strong>
                    </a>
                    <a className="button is-danger">
                      Hot
                    </a>
                  </div>
                </div>
    
              </div>
              {this.displayingRightNavItem()}
            </div>
          </div>
          </nav>
        );
    }
 }


 function mapStateToProps(state){
          return {user:state.auth.user};
}

 export default compose(
  connect(mapStateToProps,actions)
 )(Navbar);