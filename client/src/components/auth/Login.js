import React,{Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Login extends Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.removeError();
    }
    
    handleForm = (e)=>{
        e.preventDefault();
        const email = e.target.email.value;
        const password=e.target.password.value;

        const registrationData={
            email,
            password
        }

       this.props.login(registrationData,()=>{
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
                        <p className="card-header-title">Login</p>
                    </header>
                    <div className="card-content">
                       { this.errorMessage()}
                    <form onSubmit={this.handleForm}>
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
) (Login);