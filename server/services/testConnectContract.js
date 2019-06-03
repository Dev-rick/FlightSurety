import FlightSuretyApp from '../../client/src/truffle-deployment/build/contracts/FlightSuretyApp'
import Web3 from 'web3';
import Config from '../../client/src/truffle-deployment/migrations/config.json';
import secrets from '../../client/src/truffle-deployment/migration-secrets'

// function testConnectContract(req, res, next) {

// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// web3.eth.defaultAccount = web3.eth.accounts[1];

// var StudentContract = web3.eth.contract([YOUR_ABI]);

// var Student = StudentContract.at('YOUR_CONTRACT_ADD');

function testConnectContract(req, res, next) {
    console.log(req.body)
    let config = Config['migrationAddresses'];
    var web3 = new Web3(new Web3.providers.HttpProvider(
    secrets.ENDPOINT
    ));
    web3.eth.defaultAccount = web3.eth.accounts[0];
    let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.addressOfFlightSuretyData);
    console.log(flightSuretyApp);
    res.json(req.body)
    
};
    
export { testConnectContract};