import React,{Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Register extends Component{

    componentDidMount(){
        this.props.removeError();
    }

    handleForm = (e)=>{
        e.preventDefault();
        const username= e.target.username.value;
        const email = e.target.email.value;
        const password=e.target.password.value;

        const registrationData={
            username,
            email,
            password
        }

       this.props.register(registrationData,()=>{
           this.props.history.push('/');
       })
    }

    errorMessage(){
        if(this.props.error !=""){
            return(
                <p className="auth-error">{this.props.error}</p>
            );
        }
    }

    render(){
        return(
    <div className="body-content">
                <div className="container">
                    <div className="columns is-desktop">
                     <div className="column is-three-fifths is-offset-one-fifth">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">Register</p>
                    </header>
                    <div className="card-content">
                        { this.errorMessage()}
                        <form onSubmit={this.handleForm}>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input className="input" type="text" name="username" placeholder="Enter your Username" />
                            </div>
                        </div>
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
                                <button type="submit" className="button is-primary">Register</button>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            </div>
    </div>

        );
    }
}

function mapStateToProps(state){
    return {error:state.auth.error};
}

export default compose(
    connect(mapStateToProps,actions)
) (Register);