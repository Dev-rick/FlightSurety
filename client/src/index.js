//This file is only for the different routes and not for component integration
// This is done in the corresponding component assigned to the route


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import App from './components/App';
import Welcome from './components/MainPage/Welcome';
import reducers from './reducers';


const store = createStore(
  reducers,
  applyMiddleware(reduxThunk)
);


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={ Welcome } />
      </App>
    </ BrowserRouter>
  </Provider>
  ,document.querySelector('#root')
)
