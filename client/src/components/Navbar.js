import React from 'react';

 export default class Navbar extends React.Component{
    render(){
        return(
            <nav className="navbar" role="navigation" aria-label="main navigation">
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
                    <a className="button is-primary">
                      <strong>Latest</strong>
                    </a>
                    <a className="button is-danger">
                      Hot
                    </a>
                  </div>
                </div>
    
              </div>
          
              <div className="navbar-end">
              <a className="navbar-item">
                   Login
                </a>
                <a className="navbar-item">
                  Register
                </a>
              </div>
            </div>
          </div>
          </nav>
        );
    }
 }