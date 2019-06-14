import config from '../config.js'
import Web3 from 'web3';

export const web3WS = new Web3(config.networks.WS.provider);
export const web3HTTP = new Web3(config.networks.HTTP.provider);
