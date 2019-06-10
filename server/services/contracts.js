const web3 = require('./web3')
const FlightSuretyApp = require('../../client/src/truffle-deployment/build/contracts/FlightSuretyApp.json')

const list = {}

const setupFlightSuretyApp = async (networkId) => {
    console.log('setting up FlightSuretyApp')
    const deployedAddress = FlightSuretyApp.networks[networkId].address
    list.FlightSuretyApp = new web3.eth.Contract(
        FlightSuretyApp.abi,
        deployedAddress
    )
  }

  const setup = async () => {
    const networkId = await web3.eth.net.getId()
    await setupFlightSuretyApp(networkId)
  }
  
  module.exports = {
    setup,
    list
  }