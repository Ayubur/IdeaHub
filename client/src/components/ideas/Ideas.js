import React,{Component } from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import axiosConfig from '../../axiosConfig';

import NetworkError from '../NetworkError';
import Loader from '../Loader';

class Ideas extends Component{

    constructor(props){
        super(props);
        this.state={
            ideas :null,
            has_more:false,
            has_previous:false,
            page:1,
            bookmarkedIdeas:null,
            networkError:false
        }
    }

     async componentDidMount(){
         this.loadIdeas();
         this.loadBookmarkedIdeas();
    }

    loadBookmarkedIdeas = async ()=>{
            if(this.props.auth){
              try{
                const response= await axiosConfig.get('api/user',{
                    headers:{
                        authorization: `Bearer ${this.props.auth.token}`
                    }
                });

                if(! response.data.message){
                    this.setState({
                        bookmarkedIdeas: response.data.bookmarks
                    })
                }
           }
        catch(e){
            this.setState({
                networkError:true
            })
         }
       }
    }

    loadIdeas = async ()=>{
        const {page}=this.state;
        try{

            const {data}= await axiosConfig.get(`/api/ideas?page=${page}`);
            this.setState({
                ideas:data,
                has_more:data[data.length-1].has_more,
                has_previous: data[data.length-1].has_previous
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

    nextIdeas = ()=>{

        this.setState(prevstate =>{
                prevstate.page= prevstate.page+1
        },this.loadIdeas);
    }

    previousIdeas= ()=>{
        this.setState(prevstate =>{
            prevstate.page= prevstate.page-1
         },this.loadIdeas);
    }

    deleteIdea= async (e,id)=>{
        e.preventDefault();
        try{
            const {data}= await axiosConfig.delete(`/api/ideas/${id}`,{
                headers:{
                    authorization: `Bearer ${this.props.auth.token}`
                }
            });

            if(data.deleted == true){
                this.loadIdeas();
           }

        }catch(e){
            this.setState({
                networkError:true
            })
        }
         
    }

    displayPaginateButton(){
        const {has_more,has_previous}=this.state;
        if(has_more && has_previous){
            return(
                <React.Fragment>
                    <a onClick={this.previousIdeas}>
                        <span className="previousBtn">previous</span>
                    </a>
                    <a onClick={this.nextIdeas}>
                    <span className="nextBtn">next</span>
                    </a>
                </React.Fragment>
            );
        }else if(!has_previous && has_more){
            return(
                <React.Fragment>
                    <a onClick={this.nextIdeas}>
                    <span className="nextBtn">next</span>
                    </a>
                </React.Fragment>
            );
        }
        else if(has_previous && !has_more){
            return(
                <a onClick={this.previousIdeas}>
                <span className="previousBtn">previous</span>
               </a>
            );
        }
    }

    bookmark = async (e,id) =>{
        e.preventDefault();
        if(this.props.auth){
            try{
            const {data}= await axiosConfig.post(`/api/ideas/${id}/bookmark`,{},{
                headers:{
                    authorization: `Bearer ${this.props.auth.token}`
                }
            });

            if(! data.message){
                this.loadIdeas();
                this.loadBookmarkedIdeas();
           }
        }catch(e){
            this.setState({
                networkError:true
            })
        }
    }else{
            this.props.history.push('/login')
        }
    }

    unbookmark = async (e,id)=>{
        e.preventDefault();
        if(this.props.auth){
            try{
                const {data}= await axiosConfig.delete(`/api/ideas/${id}/unbookmark`,{
                    headers:{
                        authorization: `Bearer ${this.props.auth.token}`
                    }
                });
    
                if(! data.message){
                    this.loadIdeas();
                    this.loadBookmarkedIdeas();
               }
            }catch(e){
                this.setState({
                    networkError:true
                })
            }

        }else{
            this.props.history.push('/login')
        }
    }
  

   displayBookmark(id){
        if(this.props.auth && this.state.bookmarkedIdeas){
            if(this.state.bookmarkedIdeas.filter(bookmark => bookmark.id === id)<1){
                return(
                    <p className="card-footer-item">
                    <span onClick={e => this.bookmark(e,id)}>
                    <span className="icon button" >
                           <i className="far fa-star"></i>bookmark
                    </span>
                    </span>
                    </p>
                );
            }else{
                return(
                    <p className="card-footer-item">
                      <span onClick={e => this.unbookmark(e,id)}>
                        <span className="icon button">
                            <i className="fas fa-star"></i>unbookmark
                        </span>
                      </span>
                    </p>
                ); 
            }
        }else{
            return(
                <p className="card-footer-item">
                    <span onClick={e=> this.bookmark(e,id)}>
                        <span className="icon button">
                            <i className="far fa-star" ></i>bookmark
                        </span>
                    </span>
                </p>
            );
        }
    }

    displayEditDelete(authorId,id){
        if(this.props.auth){
            if(this.props.auth.id === authorId){
                return(
                    <p>
                        <a href={`/ideas/${id}/edit`}>Edit</a>
                        <a onClick={e => this.deleteIdea(e,id)} className="ml-1">Delete</a>
                    </p>
                );
            }
        }
    }

    upvotes = async(e,ideaId)=>{
        e.preventDefault();
     if(this.props.auth){
        try{
            const {data}= await axiosConfig.post(`/api/ideas/${ideaId}/upvotes`,{},{
                headers:{
                    authorization: `Bearer ${this.props.auth.token}`
                }
            });

            if(! data.message){
                this.loadIdeas();
           }

        }catch(e){
            this.setState({
                networkError:true
            })
        }
      }else{
          this.props.history.push('/login');
      }

    }

    downvotes=async (e,ideaId)=>{
        e.preventDefault();
    if(this.props.auth){
        try{
            const {data}= await axiosConfig.post(`/api/ideas/${ideaId}/downvotes`,{},{
                headers:{
                    authorization: `Bearer ${this.props.auth.token}`
                }
            });
            if(! data.message){
                this.loadIdeas();
           }

        }catch(e){
            this.setState({
                networkError:true
            })
        }
      }else{
          this.props.history.push('/login');
      }
    }


    displayIdeas(){
        if(this.state.ideas){
            return this.state.ideas.map(idea =>{
                return(
                 <div className="card ideaMargin wrapper" key={idea.id}>
                <div className="card-left-content">
                    <div className="upvote">
                     <p className="text-center"><b>{idea.upvotes}</b></p>
                    <span className="icon is-large button" onClick={e => this.upvotes(e,idea.id)}>
                           <i className="fas fa-caret-up"></i>
                    </span>
                    </div>
                    <div className="downvote">
                    <span className="icon is-large button" onClick={e => this.downvotes(e,idea.id)}>
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
                        {this.displayEditDelete(idea.author.id,idea.id)}
                     </div>

                     <footer className="card-footer">
                        {this.displayBookmark(idea.id)}
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
                <Loader />
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
                    <div className="row">
                            <div className="columns is-desktop">
                                <div className="column is-three-fifths is-offset-one-fifth ">
                                {this.displayPaginateButton()}
                                </div>
                            </div>
                    </div>
                    <div className="horizontal-space"></div>
                    <div className="horizontal-space"></div>
                    <div className="horizontal-space"></div>
                    
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

function mapToStateProps(state){
    return{
        auth:state.auth.user
    };
}

export default compose(
    connect(mapToStateProps,actions)
)(Ideas);
