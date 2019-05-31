//This file is only for the different routes and not for component integration
// This is done in the corresponding component assigned to the route


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
//applyMiddleware helps us to apply middlewares
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import {Container} from 'react-bootstrap';


import App from './components/App';
import Welcome from './components/Welcome';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import SignOut from './components/auth/SignOut';
import reducers from './reducers';
import Feature from './components/Feature';

// we can break up th App component from <App /> --> <App> ... </App> in order to
// make it a parent component of </ Welcome> component which can get access to the
// child component by using {children}

// useful to gather all the configuration in this file and that our App component
//can stay very simple and very straight forward

const store = createStore(
  reducers,
  {
    // whenever our application starts up we look if there is a token already registered
    //in the localstore of the user's browser
    auth: {authenticated: localStorage.getItem('token')}
  },
  applyMiddleware(reduxThunk)
);


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={ Welcome } />
        {/* <Route path="/signup" exact component={ SignUp } />
        <Route path="/signout" exact component={ SignOut } />
        <Route path="/signin" exact component={ SignIn } />
        <Route path="/feature" exact component={ Feature } /> */}
      </App>
    </ BrowserRouter>
  </Provider>
  ,document.querySelector('#root')
)
