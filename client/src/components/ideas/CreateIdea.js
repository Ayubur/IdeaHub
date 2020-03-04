import React,{Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class CreateIdea extends Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.removeError();
        this.shouldNavigateAway();
    }

    shouldNavigateAway(){
        if(! this.props.auth){
            this.props.history.push("/login");
        }
    }
    
    handleForm = (e) => {
        e.preventDefault();
        const idea= e.target.idea.value;
        const description= e.target.description.value;
        const token= this.props.auth.token;


        const submittedIdea={
            idea,
            description
        };

        this.props.createIdea(submittedIdea,token,()=>{
            this.props.history.push(`/ideas/${this.props.createdIdea.id}`);
        });

        
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
    <div className="auth-content">
                <div className="container">
                    <div className="columns is-desktop">
                     <div className="column is-three-fifths is-offset-one-fifth">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">Create Idea</p>
                    </header>
                    <div className="card-content">
                       { this.errorMessage()}
                    <form onSubmit={this.handleForm}>
                        <div className="field">
                          <label className="label">Idea</label>
                                <div className="control">
                                 <input className="input" type="text" name="idea" placeholder="Enter Idea" ></input>
                                </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <textarea className="textarea" name="description" placeholder="Enter description"></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-primary">submit</button>
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
    return {
        auth:state.auth.user,
        createdIdea:state.idea.idea,
        error:state.idea.error
    };
}

export default compose(
    connect(mapStateToProps,actions)
) (CreateIdea);