const web3 = require('./web3')
const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')

let ethAccount;
const list = {}

const setupFlightSuretyApp = async (networkId) => {
    console.log('setting up FlightSuretyApp')
    const deployedAddress = FlightSuretyApp.networks[networkId].address
    list.FlightSuretyApp = new web3.eth.Contract(
        FlightSuretyApp.abi,
        deployedAddress
    )
    web3.eth.getAccounts().then(e => {
        ethAccount = e[0]; 
        console.log(ethAccount);
    })
  }

  const setup = async () => {
    const networkId = await web3.eth.net.getId()
    await setupFlightSuretyApp(networkId)
  }
  
  module.exports = {
    setup,
    list
  }