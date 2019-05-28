// we import direct the action from the action creator
import { AUTH_USER, AUTH_ERROR } from '../actions/types';


// here we define the state located in the store
const INITIAL_STATE = {
  authenticated : '',
  errorMessage : ''
}


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return {...state, authenticated: action.payload}
    case AUTH_ERROR:
      return {...state, errorMessage: action.payload}
    default:
      return state;
  }
}
