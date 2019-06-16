import {web3HTTP} from './web3'
import config from '../config'
import { reject, resolve } from 'any-promise';

export default async (data, fromAccount, toAddress, gas = 2015702, value = null) => {

  const fromAddress = fromAccount.address;
  const txCount = await web3HTTP.eth.getTransactionCount(fromAddress);
  const tx = {
    nonce: txCount,
    // this could be provider.addresses[0] if it exists
    from: fromAddress, 
    // target address, this could be a smart contract address
    to: toAddress, 
    // optional if you want to specify the gas limit 
    gas: gas, 
    // optional if you are invoking say a payable function 
    //value: value,
    // this encodes the ABI of the method and the arguements
    data: data.encodeABI(),
    // chain
    chainId: config.networks.HTTP.chainId
  };
  const signedTx = await web3HTTP.eth.accounts.signTransaction(tx, fromAccount.privateKey);
  console.log("Sending transaction ...");
  return new Promise((resolve, reject) => {
    web3HTTP.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)
    .once('confirmation', (confirmationNumber, receipt) => {
      console.log("Following transaction completed", receipt.logs[0].transactionHash)
      resolve(receipt.logs)
    })
    .on('error', (err) => {
      reject(err);
    })  
  })
}

