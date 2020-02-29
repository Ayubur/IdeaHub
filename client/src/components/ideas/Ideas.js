import React,{Component } from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import axiosConfig from '../../axiosConfig';

import NetworkError from '../NetworkError';

class Ideas extends Component{

    constructor(props){
        super(props);
        this.state={
            ideas :null,
            networkError:false
        }
    }

     async componentDidMount(){
        try{

            const {data}= await axiosConfig.get('/api/ideas');
            this.setState({
                ideas:data
            });

        }catch(e){
            this.setState({
                networkError:true
            })
        }
    }

    relativeTime(date_str) {
        if (!date_str) {return;}
        date_str = date_str.trim();
        date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
        date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
        date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
        date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
        var parsed_date = new Date(date_str);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
        var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
        delta=(delta<2)?2:delta;
        var r = '';
        if (delta < 60) {
        r = delta + ' seconds ago';
        } else if(delta < 120) {
        r = 'a minute ago';
        } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
        } else if(delta < (2*60*60)) {
        r = 'an hour ago';
        } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
        } else if(delta < (48*60*60)) {
        r = 'a day ago';
        } else {
        r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
        }
        return  r;
    };

    displayIdeas(){
        if(this.state.ideas){
            return this.state.ideas.map(idea =>{
                return(
                 <div className="card ideaMargin wrapper" key={idea.id}>
                <div className="card-left-content">
                    <div className="upvote">
                     <p className="text-center"><b>{idea.upvotes}</b></p>
                    <span className="icon is-large button">
                           <i className="fas fa-caret-up"></i>
                    </span>
                    </div>
                    <div className="downvote">
                    <span className="icon is-large button">
                           <i className="fas fa-caret-down"></i>
                    </span> 
                    <p className="text-center"><b>{idea.downvotes}</b></p>
                   </div>
                </div>
                  <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                        <figure className="image is-48x48">
                          <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                      </figure>
                        </div>
                     <div className="media-content">
                        <p className="title is-4">{idea.author.username}</p>
                    </div>
                    </div>
                    <div className="content">
                    <Link to={`/ideas/${idea.id}`}>
                         <h5>{idea.idea}</h5>
                    </Link>
                        <p>{idea.description}</p>
                        <p>
                            <small><i>posted {this.relativeTime(idea.created)}</i></small>
                        </p>
                     </div>

                     <footer className="card-footer">
                        <p className="card-footer-item">
                        <span>
                        <span className="icon button">
                               <i className="far fa-star"></i>bookmark
                        </span>
                        </span>
                        </p>
                        <p className="card-footer-item">
                        <Link to={`/ideas/${idea.id}`}>
                        <span className="icon button">
                           <i className="fas fa-comments"></i>
                           comments
                        <span className="badge">{idea.comments.length}</span>
                        </span>
                        </Link>
                        </p>
                    </footer>
                </div>
            </div>
                );
            })
        }else{
            return(
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            );
        }
    } 
    render(){
      if(! this.state.networkError){
        return(
         <div className="row">
           <div className="container">
           <section className="hero">
                <div className="hero-body">
                    <h1 className="title">
                        IdeaHub
                    </h1>
                    <div className="hero-content">
                    A live crowd-sourced collection of ideas for new apps & business ideas that have been requested by the internet. Sorted by Hot, Top and New. With upvotes and downvotes.
                   To post your own idea click the "submit a new idea" button below.<br/><br/>
                    <p>
                         <Link to="/idea/create" className="button is-warning">Submit a new idea</Link>
                    </p>
                    </div>
                </div>
                </section>

                    <div className="row">
                    <div className="columns is-desktop">
                        <div className="column is-three-fifths is-offset-one-fifth">
                           {this.displayIdeas()}
                         </div>
                    </div>
                    </div>
              </div>
           </div>
        );

       }else{
           return(
               <NetworkError />
           );
       }
    }
}

export default Ideas;
