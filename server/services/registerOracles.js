import Oracle from  '../models/oracle';
import oracles from '../templates/oracles';
import makeTransaction from './makeTransaction';
import asyncForEach from '../helpers/asynForEach';
import {MetaMaskWallet} from '../config.js';


const registerOracleInDataBase = (oracle) => {
    console.log(oracle);

    Oracle.findOne({ name: oracle.name })
    .then((existingOracle) => {
        // If a Oracle with name exists, return an console.error(
        if (existingOracle) {
        // 422 unprocessed entity error
        return res.status(422).send({ error: 'Oracle does exists'});
        }
        // If a Oracle with the email does not exists, create and save Oracle record
        const oracle = new Oracle({
            name: oracle.name,
            indexes: {
                firstIndex: oracle.firstIndex,
                secondIndex: oracle.secondIndex,
                thirdIndex: oracle.thirdIndex
            } 
        });
        oracle.save()
        .then(() => {
            res.json(oracle);
        })
        .catch((err) => {
            return next(err);
        })
    
    })
    .catch((err) => {
        return next(err);
    })
}



const registerOracleInContract = (contracts) => {
    // define the contract to send the information to
    const myContract = contracts[0];
    const toAddress = myContract.options.address;
    // define the account from which it should send
    const fromAccount = MetaMaskWallet.accounts[0];
    asyncForEach(oracles, async (oracle) => {
        const data = myContract.methods.registerDefaultOracles(oracle);
        // should return resolve
        await makeTransaction(data, fromAccount, toAddress);
    })
}

    // send transaction by calling the registerDefaultOracles method
    /// --> wait for the event DefaultOracleRegistered(address oracle, uint8 firstIndex, uint8 secondIndes, uint8 thirdIndex);
    // register in mongodb






const registerOracles = (contract, metamaskAccount, callback) => async dispatch => {
    
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
        // try {
            //     // axios rquest to post oracles
            //     response = await axios.post('http://localhost:3090/registerOracles', oracleWithIndexes)
        //     console.log("SUCCESS", response);
        // } catch(err) {
            //     console.log(err)
            // }
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


module.exports = {
    registerOracleInContract,
    registerOracleInDataBase
}