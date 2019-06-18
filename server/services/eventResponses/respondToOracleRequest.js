// helps us to setup the passport library in order to handle requests visiting
// sites requiring authentication

import Oracle from '../../models/oracle';
import makeTransaction from '../makeTransaction';
import asyncForEach from '../../helpers/asynForEach';
import config from '../../config.js';

const responses = {
    STATUS_CODE_UNKNOWN : 0,
    STATUS_CODE_ON_TIME : 10,
    STATUS_CODE_LATE_AIRLINE : 20,
    STATUS_CODE_LATE_WEATHER : 30,
    STATUS_CODE_LATE_TECHNICAL : 40,
    STATUS_CODE_LATE_OTHER : 50
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const generateRandomResponse = () => {
    let arrayOfResponses = Object.values(responses);
    let randomindex = getRandomInt(5);
    return arrayOfResponses[randomindex]
} 

module.exports = (contract, decodedData) => {
    // define the contract to send the information to
    const requestedIndex = decodedData[0];
    const myContract = contract;
    const toAddress = myContract.options.address;
    // define the account from which it should send
    const fromAccount = config.MetaMaskWallet.accounts[0];
    Oracle.find()
    .then((oracles) => {
        asyncForEach(oracles, async (oracle) => {
            const isMatch = await oracle.compareIndexes(requestedIndex) 
            let randomResponse = generateRandomResponse();
            if (isMatch) {
                ///@dev Fix randomResponse to 20 for testing purposes
                const data = myContract.methods.submitOracleResponse(decodedData[0], decodedData[1], decodedData[2], decodedData[3], randomResponse);
                try{
                    const logs = await makeTransaction(data, fromAccount, toAddress, 500000);
                    console.log("Response from oracle:", logs)
                    return;
                } catch(err) {
                    console.log(err)
                }
            }
        })
    })
}
