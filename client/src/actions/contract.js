import { WEB3_PROVIDER } from './types';
import Web3 from 'web3';

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
export const initWeb3 = (formProps, callback) => async dispatch => {
    if (window.ethereum) {
        dispatch({
            type: WEB3_PROVIDER,
            payload: window.ethereum,
        })
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        dispatch({
            type: WEB3_PROVIDER,
            payload: window.web3.currentProvider,
        })
    }
    // If no injected web3 instance is detected, fall back to Ganache-cli
    else {
        dispatch({
            type: WEB3_PROVIDER,
            payload: new Web3.providers.HttpProvider('http://localhost:8545')
        })
    }
}
