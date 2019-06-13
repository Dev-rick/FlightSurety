import setUpContracts from './setUpContracts';
import {subscribeToEvent} from './subscribeToEvent';
import {registerOracleInContract, registerOracleInDataBase} from './registerOracles';
// import makeTransaction from './makeTransaction';
import respondToOracleRequest from './respondToOracleRequest';

module.exports = {
    setUpContracts,
    subscribeToEvent,
    respondToOracleRequest,
    registerOracleInContract,
    registerOracleInDataBase
    // registerOracles,
    // makeTransaction,
    // setupWeb3
}



//// SETTIN WS contract and http list