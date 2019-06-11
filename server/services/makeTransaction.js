const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')
import Web3 from 'web3';
import secrets from '../../client/src/truffle-deployment/migration-secrets';
import HDWalletProvider from 'truffle-hdwallet-provider';
const EthereumTx = require('ethereumjs-tx').Transaction



const makeTransaction = async (decodedData, randomResponse) => {
  // 12 word mnemonic for HD Wallet Provider
  // You can use any provider such as the HttpProvider if you are
  // signing with private key

  const provider = new Web3.providers.HttpProvider(secrets.ENDPOINT);
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  console.log(networkId);
  const deployedAddress = FlightSuretyApp.networks[networkId].address
  const myContract = new web3.eth.Contract(FlightSuretyApp.abi, deployedAddress);
  console.log(decodedData);


// the address that will send the test transaction
const addressFrom = '0x0be3dCDC09881e9e0773ce9287061Ff803A38d3d'
const privKey = '8B59E6268E70817322AAC6CCFA174C99D0AE6B75236873224162EDFABE2B9406'

// the destination address
const addressTo = deployedAddress;

// Signs the given transaction data and sends it. Abstracts some of the details 
// of buffering and serializing the transaction for web3.
function sendSigned(txData, cb) {
  const privateKey = Buffer.from(privKey, 'hex')
  const transaction = new EthereumTx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(addressFrom).then(txCount => {
  const gasLimit = 25000
  const gasPrice = 10e9
  const value = 123
  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount.toString()),
    gasLimit: web3.utils.toHex(gasLimit.toString()),
    gasPrice: web3.utils.toHex(gasPrice.toString()), // 10 Gwei
    to: addressTo,
    from: addressFrom,
    value: web3.utils.toHex(web3.utils.toWei(value.toString(), 'wei')),
    data: web3.utils.toHex(myContract.methods.submitOracleResponse(decodedData[0], decodedData[1], decodedData[2], decodedData[3], randomResponse).encodeABI()) 
  }
  // data: web3.utils.toHex(myContract.methods.getBalance().encodeABI())

  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })

})




}


  module.exports = {
    makeTransaction
  }