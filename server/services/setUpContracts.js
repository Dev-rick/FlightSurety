import config from '../config';
import {web3HTTP} from './web3.js'

let  listOfContractsOnHTTP = []

const setup = (contract) => {
  console.log('setting up contract')
  const networkIdHTTP = config.networks.HTTP.chainId;
  const deployedAddressHTTP = contract.networks[networkIdHTTP].address
  const MyContractonHTTP = new web3HTTP.eth.Contract(
    contract.abi,
    deployedAddressHTTP
    ) 
  listOfContractsOnHTTP.push(MyContractonHTTP);
  }
  
export default () => {
  for (let i = 0; i < config.contractsConfig.length; i++) {
    console.log(config);
    const contract = require (`../${config.contractsConfig[i].path}${config.contractsConfig[i].name}.json`);
    setup(contract);
  }
  return listOfContractsOnHTTP;
}
  
