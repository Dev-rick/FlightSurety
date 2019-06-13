import {contractsConfig, networks} from '../config';
import {web3WS, web3HTTP} from './web3.js'

let contracts = {
  listOfContractsOnHTTP : [],
  listOfContractsOnWS : []
}

const setup = (contract) => {
  console.log('setting up contract')
  const networkIdWS = networks.WS.chainId;
  const networkIdHTTP = networks.HTTP.chainId;
  const deployedAddressWS = contract.networks[networkIdWS].address
  const deployedAddressHTTP = contract.networks[networkIdHTTP].address
  const MyContractonWS = new web3WS.eth.Contract(
    contract.abi,
    deployedAddressWS
    )
  const MyContractonHTTP = new web3HTTP.eth.Contract(
    contract.abi,
    deployedAddressHTTP
    ) 
  contracts.listOfContractsOnWS.push(MyContractonWS);
  contracts.listOfContractsOnHTTP.push(MyContractonHTTP);
  }
  
const setUpContracts = () => {
  for (let i = 0; i < contractsConfig.length; i++) {
    const contract = require (`../${contractsConfig[i].path}${contractsConfig[i].name}.json`);
    setup(contract);
  }
  return contracts;
}
  
module.exports = setUpContracts;