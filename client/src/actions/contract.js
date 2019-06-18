import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import { CONTRACT, METAMASK_ACCOUNT, WEB3_PROVIDER, WEB3, ETHERS} from './types';
import FlightSuretyApp from '../blockchain/build/contracts/FlightSuretyApp';

export const initWeb3 = (callback) => async dispatch => {
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
    const web3 = new Web3(web3Provider);
        dispatch({
            type: WEB3,
            payload: web3
        })
        // Retrieving accounts

    try {
        const accounts = await web3.eth.getAccounts()
        dispatch({
            type: METAMASK_ACCOUNT,
            payload: accounts[0]
        })
    } 
    catch(err) {
        console.log(err);
    }   
    callback();
}

export const initContract = (web3Provider, callback) => async dispatch => {
    
    /// JSONfy the smart contracts
    const FlightSuretyAppContract = await TruffleContract(FlightSuretyApp);

    FlightSuretyAppContract.setProvider(web3Provider);
    const instance = await FlightSuretyAppContract.deployed();
    console.log(web3Provider);

    console.log("Should be done");
    dispatch({
        type: CONTRACT,
        payload: instance
    })
    callback(instance);
}


