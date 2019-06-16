// we import direct the action from the action creator
import { WEB3_PROVIDER, METAMASK_ACCOUNT, CONTRACT, WEB3, ETHERS} from '../actions/types';


// here we define the state located in the store
const INITIAL_STATE = {
    web3Provider: null,
    web3: null,
    metamaskAccount: null,
    contract: {},
    ethers: null
}


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case WEB3_PROVIDER:
      return {...state, web3Provider: action.payload}
    case METAMASK_ACCOUNT:
      return {...state, metamaskAccount: action.payload}
    case CONTRACT:
      return {...state, contract: action.payload}
    case WEB3:
      return {...state, web3: action.payload}
    case ETHERS:
      return {...state, ethers: action.payload}
    default:
      return state;
  }
}
