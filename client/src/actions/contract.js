import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import { CONTRACT, METAMASK_ACCOUNT, WEB3_PROVIDER } from './types';
import FlightSuretyApp from '../truffle-deployment/build/contracts/FlightSuretyApp'
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
    callback();
}

export const getMetaskAccountID = (web3Provider, callback) => async dispatch => {

    let web3 = new Web3(web3Provider);
        // Retrieving accounts
    web3.eth.getAccounts(function(err, res) {
        if (err) {
            console.log('Error:',err);
            return;
        }
        console.log('getMetaskID:',res);
        dispatch({
            type: METAMASK_ACCOUNT,
            payload: res[0]
        })
    })
    callback();
}

export const initContract = (web3Provider, callback) => async dispatch => {


    /// JSONfy the smart contracts
    const FlightSuretyAppContract = await TruffleContract(FlightSuretyApp);
    dispatch({
        type: CONTRACT,
        payload: TruffleContract(FlightSuretyAppContract)
    })
    callback();
}
