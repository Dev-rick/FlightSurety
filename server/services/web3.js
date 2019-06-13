import {networks} from '../config.js'
import Web3 from 'web3';

const web3WS = new Web3(networks.WS.provider);
const web3HTTP = new Web3(networks.HTTP.provider);

module.exports = {
    web3WS,
    web3HTTP
}
