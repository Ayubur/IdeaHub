import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Ideas from "./components/ideas/Ideas";
import Idea from "./components/ideas/idea";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Logout from "./components/auth/Logout";
import {BrowserRouter, Route} from 'react-router-dom';

import {Provider} from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from 'redux-thunk';
import reducers from "./reducers";
import { loadState,saveState} from './localStorage/localStorage';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash.throttle';


const App=()=>{
        const persistedState = localStorage.getItem('state') ? {
          auth:{user:{token:localStorage.getItem('state')}}
        } : {
          auth:{user:null}
        };

        const store = createStore(reducers,persistedState,composeWithDevTools(
          applyMiddleware(reduxThunk)
      ));
  return (
      <React.Fragment>
        <Provider store={store}>
        <BrowserRouter>
            <React.Fragment>
               <Navbar />
               <Route exact path="/" component={Ideas} />
               <Route exact path="/idea/:id" component={Idea} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/register" component={Register}/>
               <Route exact path="/logout" component={Logout}/>
            </React.Fragment>
        </BrowserRouter>
        </Provider>
      </React.Fragment>
  );
}

export default App;
