import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import { CONTRACT, METAMASK_ACCOUNT, WEB3_PROVIDER, ORACLES } from './types';
import FlightSuretyApp from '../truffle-deployment/build/contracts/FlightSuretyApp';
import axios from 'axios';


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

export const registerOracles = (contract, metamaskAccount, callback) => async dispatch => {
    
        const oracles = await axios.get('http://localhost:3090/getOracles');
        const ArrayOfOracles = oracles.data;
        class Oracle  {
            constructor(name, indexes) {
                this.name = name;
                this.indexes = indexes;
            }
        }
        class Indexes {
            constructor(firstIndex, secondIndex, thirdIndex) {
                this.firstIndex = firstIndex;
                this.secondIndex = secondIndex;
                this.thirdIndex = thirdIndex;
            }
        }
        //map function
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
              await callback(array[index], index, array);
            }
          }

        let oraclesWithIndexes = [];
        await asyncForEach(ArrayOfOracles, async (oracle) => {
            let indexes;
            let response;
            let indexObject;
            let oracleWithIndexes;
            try{
                await contract.registerDefaultOracles(oracle, {from: metamaskAccount});
            } catch(err) {
                console.log("Some Error in the contract function registerDefaultOracles", err);
            }
            try {
                indexes = await contract.getIndexOfOracle.call(oracle);
                indexObject = new Indexes(indexes[0].words[0], indexes[1].words[0], indexes[2].words[0]);
                oracleWithIndexes = new Oracle(oracle, indexObject);
            } catch(err) {
                console.log("Some Error in the contract function getIndexOfOracle", err);
            }
            try {
                // axios rquest to post oracles
                response = await axios.post('http://localhost:3090/registerOracles', oracleWithIndexes)
                console.log("SUCCESS", response);
            } catch(err) {
                console.log(err)
            }
            oraclesWithIndexes.push(oracleWithIndexes);
            
        });
        console.log('Oracles are registered');
        // not needed as implemented in server
        dispatch({
          type: ORACLES,
          payload: oraclesWithIndexes
        })
        callback();
}
