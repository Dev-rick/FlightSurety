// we import direct the action from the action creator
import { WEB3_PROVIDER, METAMASK_ACCOUNT, CONTRACT } from '../actions/types';


// here we define the state located in the store
const INITIAL_STATE = {
    web3Provider: null,
    metamaskAccount: null,
    contract: {},
    owner: null,
    users: [],
    airlines: [],
    admins: [],
    passengers: []
}


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WEB3_PROVIDER:
      return {...state, web3Provider: action.payload}
    case METAMASK_ACCOUNT:
      return {...state, metamaskAccount: action.payload}
    case CONTRACT:
      return {...state, contract: action.payload}
    default:
      return state;
  }
}
