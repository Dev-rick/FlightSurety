// we import direct the action from the action creator
import { FLIGHT } from '../actions/types';


// here we define the state located in the store
const INITIAL_STATE = {
    flight: "",
}


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FLIGHT:
      return {...state, flight: action.payload}
    default:
      return state;
  }
}
