const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')
import Web3 from 'web3';
import secrets from '../../client/src/truffle-deployment/migration-secrets';
import HDWalletProvider from 'truffle-hdwallet-provider';

// in this version I have done the following:
// I implemented  the following solution again: https://medium.com/finnovate-io/how-do-i-sign-transactions-with-web3-f90a853904a2
// in addition I added the nonce and the chainId

const makeTransaction = async (decodedData, randomResponse) => {
  // 12 word mnemonic for HD Wallet Provider
  // You can use any provider such as the HttpProvider if you are
  // signing with private key

  // 12 word mnemonic for HD Wallet Provider
  // You can use any provider such as the HttpProvider if you are
  // signing with private key
  const provider = new HDWalletProvider(secrets.mnemonic, secrets.ENDPOINT);
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  const deployedAddress = FlightSuretyApp.networks[networkId].address;
  const myContract = new web3.eth.Contract(FlightSuretyApp.abi, deployedAddress);
  const fromAddress = '0x309Fc768373E7141b3055dBcc1833668C11B7291'
  const txCount = await web3.eth.getTransactionCount(fromAddress);
  console.log(provider.addresses[0])

  const tx = {
    nonce: txCount,
    // this could be provider.addresses[0] if it exists
    from: fromAddress, 
    // target address, this could be a smart contract address
    to: deployedAddress, 
    // optional if you want to specify the gas limit 
    gas: 24088, 
    // optional if you are invoking say a payable function 
    // value: value,
    // this encodes the ABI of the method and the arguements
    data: myContract.methods.submitOracleResponse(decodedData[0], decodedData[1], decodedData[2], decodedData[3], randomResponse).encodeABI(),
    // chain
    chainId: 4
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, secrets.privateKey);
  signPromise.then((signedTx) => {
    // raw transaction string may be available in .raw or 
    // .rawTransaction depending on which signTransaction
    // function was called
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on("receipt", receipt => {
      // do something when receipt comes back
      console.log(receipt);
    });
    sentTx.on("error", err => {
      // do something on transaction error
      console.log(err);
    });
  }).catch((err) => {
    // do something when promise fails
    console.log(err);
  });

}

  module.exports = {
    makeTransaction
  }