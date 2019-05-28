import { AUTH_USER, AUTH_ERROR } from './types';
import axios from 'axios';


// export const signup = ({ email, password }) => {
//   return function(dispatch) {
//
//   }
// }
// the same as:
// export const signup = ({ email, password }) => dispatch => {
//
// };



//signup is an action creator
// callback marked with () in the SignUp component
export const signup = (formProps, callback) => async dispatch => {
  try{
    const response = await axios.post('http://localhost:3090/signup', formProps)
    dispatch({
      type: AUTH_USER,
      payload: response.data.token
    })
    // stores our token into the local store of the browser
    localStorage.setItem('token', response.data.token)
    callback();
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
      payload: 'email is in use'
    })
  }
};

export const signin = (formProps, callback) => async dispatch => {
  try{
    const response = await axios.post('http://localhost:3090/signin', formProps)
    dispatch({
      type: AUTH_USER,
      payload: response.data.token
    })
    // stores our token into the local store of the browser
    localStorage.setItem('token', response.data.token)
    callback();
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
      payload: 'invalid login credentials'
    })
  }
};

//as we are no API request no need for access of the dispatch function
export const signout = () => {
  // delete token from localStorage
  localStorage.removeItem('token');

  // we use the same type
  // by reusing
  // empty string means false
  return {
    type: AUTH_USER,
    payload: ''
  };
};
