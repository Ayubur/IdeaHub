import React,{Component } from 'react';

class Login extends Component{

    render(){
        return(
    <div className="body-content">
                <div className="container">
                    <div className="columns is-desktop">
                     <div className="column is-three-fifths is-offset-one-fifth">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">Login</p>
                    </header>
                    <div className="card-content">
                        <div className="field">
                          <label className="label">Email</label>
                                <div className="control">
                                    <input className="input" type="email" name="email" placeholder="Enter Email" />
                                </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input className="input" type="password" name="password" placeholder="Enter Password" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-primary">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
    </div>

        );
    }
}

export default Login;