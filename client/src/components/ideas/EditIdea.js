import React,{Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import NetworkError from '../NetworkError';
import Loader from '../Loader';
import axiosConfig from '../../axiosConfig';


class EditIdea extends Component{

    constructor(props){
        super(props);
        this.state={
            idea:null,
            networkError:false
        }
    }

   async componentDidMount(){
        this.props.removeError();
        this.shouldNavigateAway();

        try{
            const id= this.props.match.params.id;
            const {data}= await axiosConfig.get(`/api/ideas/${id}`);
            this.setState({
                idea:data
            });

        }catch(e){
            this.setState({
                networkError:true
            })
        }
    }

    shouldNavigateAway(){
        if(! this.props.auth){
            this.props.history.push("/login");
        }
    }

    handleChange= (e)=>{
        this.setState({
            idea:{
                ...this.state.idea,
                [e.target.name]:e.target.value
            }
        })

    }
    
    handleForm = (e) => {
        e.preventDefault();
        const {idea}= this.state;

        const token= this.props.auth.token;

        let submittedIdea={
            idea:idea.idea,
            description:idea.description
        }

        this.props.updateIdea(submittedIdea,token,this.state.idea.id,()=>{
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
        const {idea,networkError}=this.state;
        if(! networkError){
            if(idea){
                return(
                    <div className="auth-content">
                                <div className="container">
                                    <div className="columns is-desktop">
                                     <div className="column is-three-fifths is-offset-one-fifth">
                                <div className="card">
                                    <header className="card-header">
                                        <p className="card-header-title">Edit Idea</p>
                                    </header>
                                    <div className="card-content">
                                       { this.errorMessage()}
                                    <form onSubmit={this.handleForm}>
                                        <div className="field">
                                          <label className="label">Idea</label>
                                                <div className="control">
                                                 <input className="input" type="text" name="idea" placeholder="Enter Idea" value={idea.idea} 
                                                 onChange={e => this.handleChange(e)}></input>
                                                </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Description</label>
                                            <div className="control">
                                                <textarea className="textarea" name="description" placeholder="Enter description"
                                                 value={idea.description} onChange={e => this.handleChange(e)}></textarea>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="control">
                                                <button className="button is-primary">update</button>
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

            }else{
                return(
                   <div className="idea-content">
                    <Loader />
                   </div>
                );
            }
        }else{
            return(
                <NetworkError />
            );
        }
        
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
) (EditIdea);