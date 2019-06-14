import oracles from '../templates/oracles';
import makeTransaction from './makeTransaction';
import asyncForEach from '../helpers/asynForEach';
import config from '../config.js';

export default (contracts) => {
    // define the contract to send the information to
    const myContract = contracts[0];
    const toAddress = myContract.options.address;
    // define the account from which it should send
    const fromAccount = config.MetaMaskWallet.accounts[0];
    asyncForEach(oracles, async (oracle) => {
        const data = myContract.methods.registerDefaultOracles(oracle);
        // should return resolve
        try{
            await makeTransaction(data, fromAccount, toAddress);
        } catch(err) {
            console.log(err);
        }
    })
}

    // send transaction by calling the registerDefaultOracles method
    /// --> wait for the event DefaultOracleRegistered(address oracle, uint8 firstIndex, uint8 secondIndes, uint8 thirdIndex);
    // register in mongodb


