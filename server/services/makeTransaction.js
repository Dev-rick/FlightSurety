const web3 = require('web3')
const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')
import secrets from '../../client/src/truffle-deployment/migration-secrets';
import HDWalletProvider from 'truffle-hdwallet-provider';



const makeTransaction = () => {
  // 12 word mnemonic for HD Wallet Provider
// You can use any provider such as the HttpProvider if you are
// signing with private key

const provider = new HDWalletProvider(secrets.mnemonic, secrets.ENDPOINT);
const web3 = new Web3(provider);
const deployedAddress = FlightSuretyApp.networks[networkId].address
const myContract = new web3.eth.Contract(FlightSuretyApp.abi,deployedAddress);

const tx = {
  // this could be provider.addresses[0] if it exists
  from:  provider.addresses[0], 
  // target address, this could be a smart contract address
  to: deployedAddress, 
  // optional if you want to specify the gas limit 
  gas: gasLimit, 
  // optional if you are invoking say a payable function 
  value: value,
  // this encodes the ABI of the method and the arguements
  data: myContract.methods.myMethod(arg, arg2).encodeABI() 
};


const signPromise = web3.eth.signTransaction(tx, tx.from);


//locked account
const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

signPromise.then((signedTx) => {
  // raw transaction string may be available in .raw or 
  // .rawTransaction depending on which signTransaction
  // function was called
  const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
  sentTx.on("receipt", receipt => {
    // do something when receipt comes back
  });
  sentTx.on("error", err => {
    // do something on transaction error
  });
}).catch((err) => {
  // do something when promise fails
});

}


  module.exports = {
    makeTransaction
  }