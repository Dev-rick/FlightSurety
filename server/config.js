import HDWalletProvider from 'truffle-hdwallet-provider';
import secrets from './secrets';
// import registerOracleInDataBase from './services/eventResponses/registerOracleInDataBase';
// import respondToOracleRequest from './services/respondToOracleRequest';


const devMode = false;
//==================devMode======================//

// set devMode = true
// open a terminal and run: $ mongod
// open a terminal and run: $ ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
// open a terminal in your blockchain directory and run: $ truffle migrate --reset
// get from there the networkId
const networkIdDev = 1560520817919;
// open a terminal in your server directory and run: $ npm run dev
// in the terminal in your blockchain directory run: $ truffle test

//==================liveMode=====================//

// set devMode = true;
// open a terminal and run: $ mongod
// open a terminal in your blockchain directory and run: $ truffle migrate --network rinkeby -f 2 --reset
// open a terminal in your server directory and run: $ npm run dev

const developmentAccount = {
    address : '0x27d8d15cbc94527cadf5ec14b69519ae23288b95',
    privateKey : '0x9137dc4de37d28802ff9e5ee3fe982f1ca2e5faa52f54a00a6023f546b23e779'
}


const config = {
    contractsConfig : [{
        name : 'FlightSuretyApp',
        path : '../client/src/blockchain/build/contracts/',
        eventsToWatch : [{
            name: 'OracleRequest',
            topic: ['0x3ed01f2c3fc24c6b329d931e35b03e390d23497d22b3f90e15b600343e93df11'],
            types: ['uint8', 'address', 'string', 'uint256'],
            // same name as file in eventResponses directory
            method: "respondToOracleRequest"
        },
        {
            name: 'DefaultOracleRegistered',
            topic: ['0xec998c8375daa0d383a770abe926ca5f0809eeaf5e855049892dc7ebc87bc0c6'],
            types: ['address', 'uint8', 'uint8', 'uint8'],
            // same name as file in eventResponses directory
            method: "registerOracleInDataBase"
        }]
    }],
    networks : {
        WS : {
            provider: devMode ? 'ws://127.0.0.1:8545': 'wss://rinkeby.infura.io/ws',
            chainId : devMode ? networkIdDev : 4
        },
        HTTP : {
            provider: devMode ? 'http://127.0.0.1:8545' : new HDWalletProvider(secrets.mnemonic, secrets.ENDPOINT),
            chainId: devMode ? networkIdDev : 4
        }
    },
    MetaMaskWallet : {
        accounts : [{
            address : devMode ? developmentAccount.address: '0x309Fc768373E7141b3055dBcc1833668C11B7291',
            privateKey : devMode ? developmentAccount.privateKey : secrets.privateKey
        }]
    }
}

export default config;