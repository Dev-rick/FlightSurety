# FLIGHT INSURANCE APP

This repository containts an Ethereum DApp that demonstrates a flight insurance application 

**CURRENT:** live version of contract: [ETHERSCAN](https://rinkeby.etherscan.io/address/0xc28e8e5c8628F625d5b56b056ef04e9D1c036A19)

## Preview

![app-preview-image-1](https://github.com/Userrick/FlightSurety/blob/master/images/app-image-1.PNG)
![app-preview-image-2](https://github.com/Userrick/FlightSurety/blob/master/images/app-image-2.PNG)


## Getting Started

These instructions will get you a copy of the FlightSurety.app and lets you run the client on the local machine and deploys your own contract to the test network rinkeby.

### Prerequisites

Please make sure you've enabled [MetaMask extension](https://metamask.io/) in your browser and [gulp](https://gulpjs.com/) installed.

### Installing and Using the FlightSurety Contracts for Yourself on the RINKEBY TESTNETWORK

#### Client Setup

1. Clone this repository:

    ```bash
    $ git clone https://github.com/Userrick/FlightSurety
    ```

2. Got to Flightsurety/client/ and install all requisite npm packages (as listed in ```package.json```):

    ```bash
    $ npm install
    ```

3. Create a new file in **FlightSurety/client/src/blockchain/** with the name **migration-secrets.js**:

    ```bash
    $ touch migration-secrets.js
    ```
4. Install truffle-hdwallet-provider in **FlightSurety/client/src/blockchain/**: 

    ```bash
    $ npm install
    ```

5. Copy the following into it (attention to https://):

    ```javascript
    const secrets = {
        address: "YOUR ADDRESS WHICH WILL ALSO BE THE FIRST ADMIN OF FLIGHTSURETYDATA CONTRACT"
        mnemonic: "YOUR-SEED-WORDS-FROM-METAMASK-ACCOUNT",
        ENDPOINT: "https://YOUR-INFURA-ENDPOINT_KEY"
    }

    module.exports = secrets;
    ```

6. Follow [this guide](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-Reveal-Your-Seed-Phrase) to reveal your seed words from your METAMASK account. 

    a) **Be sure to be on the rinkeby testnetwork**

    b) Copy your seed words from your METAMASK into the respective marked section of the **secrets-migration.js** file


7. Visit the [infura website](https://www.infura.io) 

    a) login or create account

    b) create a new project 

    c) COPY the endpoint from the project to clipboard

    ![INFURA-key](https://github.com/Userrick/Simple-Supply-Chain-Udacity/blob/master/tutorial-images/INFURA-key.PNG)

    d) PASTE it into the respective field in the **secrets-migration.js** file

8. Now launch your personal flight insurance contracts to the network by following these commands:

    ```bash
    $ truffle compile

    $ truffle migrate --reset --network rinkeby
    ```

9. Now launch the client by the following command:

    ```bash
    $ npm start
    ```

#### Client Setup

1. Got to Flightsurety/server/ and install all requisite npm packages (as listed in ```package.json```):

    ```bash
    $ npm install
    ```

2. Create a new file in **FlightSurety/server/** with the name **secrets.js**:

    ```bash
    $ touch secrets.js
    ```

3. Copy the following into it (attention to https://):

    ```javascript
    const secrets = {
        mnemonic: "YOUR-SEED-WORDS-FROM-METAMASK-ACCOUNT",
        ENDPOINT: "https://YOUR-INFURA-ENDPOINT_KEY",
        privateKey: "YOUR-PRIVATE-KEY-OF-METAMASK-ACCOUNT-USED-FOR-REGISTRATING-DEFAULT-ORACLES-AND-ALSO-RESPOND-TO-ORACLE-REQUEST"
    }

    module.exports = secrets;
    ```

4. Edit the **config.js** file in Flightsurety/server/ to your needs 

    Make sure to use the same address as for deploying your smart contract!

5. Install MongoDB from [MONGODB](https://www.mongodb.com/)

6. Open New Terminal and run: 

    ```bash
    $ mongod
    ```

7. Now launch the server by the following command in a new terminal and wait until every oracle of the 40 are registered:

    ```bash
    $ npm run dev
    ```

    Now you should be able to interact with your contract at [LOCALHOST](http://localhost:3000/) via METAMASK on the rinkeby test network.

    **If you encounter some issues let me know!**

    **Enjoy!**

### Testing without losing too much eth and for that oracles from server work properly on rinkeby

1. Make sure to search for all the comments in the FlightSuretyApp and FlightSuretyData contract marked with ///@dev and comment the direct below require statement out.

## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier. 
* [truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider) - HD Wallet-enabled Web3 provider. Use it to sign transactions for addresses derived from a 12-word mnemonic.
* [NODE + NPM](https://github.com/nodejs/node)
* [MONGODB](https://www.mongodb.com/) - The database for modern applications
* [REACT](https://reactjs.org/) - A JavaScript library for building user interfaces
* [REACT-Bootstrap](https://react-bootstrap.github.io/) - The most popular front-end framework Rebuilt for React. 

## Version Used

* Truffle v5.0.22 (core: 5.0.22)
* Solidity v0.5.8 (solc-js)
* Node v12.4.0
* Web3.js v1.0.0-beta.37

## Authors

Starter code was provided by [Udacity](https://github.com/udacity/FlightSurety)

## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)