import config from '../config';
import {web3WS, web3HTTP} from './web3.js'

let contracts = {
  listOfContractsOnHTTP : [],
  listOfContractsOnWS : []
}

const setup = (contract) => {
  console.log('setting up contract')
  const networkIdWS = config.networks.WS.chainId;
  const networkIdHTTP = config.networks.HTTP.chainId;
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
  
export default () => {
  for (let i = 0; i < config.contractsConfig.length; i++) {
    const contract = require (`../${config.contractsConfig[i].path}${config.contractsConfig[i].name}.json`);
    setup(contract);
  }
  return contracts;
}
  
