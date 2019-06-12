const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')
import Web3 from 'web3';
import secrets from '../../client/src/truffle-deployment/migration-secrets';
import HDWalletProvider from 'truffle-hdwallet-provider';
const EthereumTx = require('ethereumjs-tx').Transaction

// Every solution has functioned, thebug was always that you should have specified the chainId = 4 in every transaction!!
// implement the following solution again: https://medium.com/finnovate-io/how-do-i-sign-transactions-with-web3-f90a853904a2


// in this version I have done the following:

// installed geth
// https://ethereum.stackexchange.com/questions/465/how-to-import-a-plain-private-key-into-geth-or-mist
// Paste key into notepad without any extra characters or quotations
// Save the file as nothing_special_delete_me.txt at C:\
// Run the command, geth account import C:\nothing_special_delete_me.txt
// After successful import, delete the file at C:\nothing_special_delete_me.txt
// Copeid the keytore file into this dir: $ cp -r ~/.ethereum/keystore /mnt/c/Users/rickw/Development/Blockchain-Projects/FlightSurety/server/keystore
// Copied in the fields below

const makeTransaction = async (decodedData, randomResponse) => {
  // 12 word mnemonic for HD Wallet Provider
  // You can use any provider such as the HttpProvider if you are
  // signing with private key

  
  // connect to any peer; using infura here
  const web3 = new Web3(new Web3.providers.HttpProvider(secrets.ENDPOINT));
  const networkId = await web3.eth.net.getId()
  const deployedAddress = FlightSuretyApp.networks[networkId].address
  const myContract = new web3.eth.Contract(FlightSuretyApp.abi, deployedAddress);
  const addressTo = deployedAddress;
  const txCount = await web3.eth.getTransactionCount('eb56ebc9d1bc1b8651c373cee2b38c7149ee15ab');

  // contents of keystore file, can do a fs read
  const keystore = {"address":"eb56ebc9d1bc1b8651c373cee2b38c7149ee15ab","crypto":{"cipher":"aes-128-ctr","ciphertext":"0fcdd910b4df5fe4dbf9b8842deb4f28f9cdff39f76281359b6d88e422b013ec","cipherparams":{"iv":"2f54674d46d27d99491d7431984a38b3"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"14ad9290d92381846c556d0afd1fe945bdef710a03ac84c5897b93efb7b2f758"},"mac":"31e33b1e99a5c48a393ac9ffb46186491b14313e3502faf68d3fcae3b7680816"},"id":"a48ebf5e-bd45-4f09-990d-faa573c4681f","version":3};
  const decryptedAccount = web3.eth.accounts.decrypt(keystore, 'karatefreak');
  
  const rawTransaction = {
    "from": "eb56ebc9d1bc1b8651c373cee2b38c7149ee15ab",
    "to": addressTo,
    // "value": web3.utils.toHex(web3.utils.toWei("0.001", "ether")),
    "gas": 200000,
    "nonce": web3.utils.toHex(txCount.toString()),
    "data": web3.utils.toHex(myContract.methods.submitOracleResponse(decodedData[0], decodedData[1], decodedData[2], decodedData[3], randomResponse).encodeABI()), 
    "chainId": 4
  };
  decryptedAccount.signTransaction(rawTransaction)
    .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    .then(receipt => console.log("Transaction receipt: ", receipt))
    .catch(err => console.error(err));
  // Or sign using private key from decrypted keystore file
  /*
  web3.eth.accounts.signTransaction(rawTransaction, decryptedAccount.privateKey)
    .then(console.log);
  */
}

  module.exports = {
    makeTransaction
  }