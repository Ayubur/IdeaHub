import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Ideas from "./components/ideas/Ideas";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import {BrowserRouter, Route} from 'react-router-dom';

import {Provider} from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from 'redux-thunk';
import reducers from "./reducers";
import { loadState,saveState} from './localStorage/localStorage';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash.throttle';


const App=()=>{
      const persistedState = loadState();

      const store = createStore(reducers,persistedState,composeWithDevTools(
        applyMiddleware(reduxThunk)
    ));

    
      store.subscribe(throttle(() => {
        saveState({
          auth: store.getState().auth
        });
      }, 1000));
  
  return (
      <React.Fragment>
        <Provider store={store}>
        <BrowserRouter>
            <React.Fragment>
               <Navbar />
               <Route exact path="/" component={Ideas} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/register" component={Register}/>
            </React.Fragment>
        </BrowserRouter>
        </Provider>
      </React.Fragment>
  );
}

export default App;
