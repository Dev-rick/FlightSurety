// we import direct the action from the action creator
import { FLIGHT, TIMESTAMP } from '../actions/types';


// here we define the state located in the store
const INITIAL_STATE = {
    flight: "",
    timestamp: null
}


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FLIGHT:
      return {...state, flight: action.payload}
    case TIMESTAMP:
      return {...state, timestamp: action.payload}
    default:
      return state;
  }
}
