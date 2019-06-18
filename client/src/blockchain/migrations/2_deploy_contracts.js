// migrating the appropriate contracts
var FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
var FlightSuretyData = artifacts.require("./FlightSuretyData.sol");
const fs = require('fs');
const secrets = require('../migration-secrets');

module.exports = async function(deployer) {
    // For testing: Make sure its your address of addressOfFirstAirline 
    const addressOfFirstAirline = secrets.address;
    const balance = 0;
    await deployer.deploy(FlightSuretyData, addressOfFirstAirline, balance);
    const instanceOfFlightSuretyData = await FlightSuretyData.deployed();
    const addressOfFlightSuretyData = await instanceOfFlightSuretyData.address;
    await deployer.deploy(FlightSuretyApp, addressOfFlightSuretyData);
    const instanceOfFlightSuretyApp = await FlightSuretyApp.deployed();
    const addressOfFlightSuretyApp = await instanceOfFlightSuretyApp.address;
    let config = {
        migrationAddresses: {
            dataAddress: addressOfFlightSuretyData,
            appAddress: addressOfFlightSuretyApp
        }
    }
    fs.writeFileSync(__dirname + 'config.json',JSON.stringify(config, null, '\t'), 'utf-8');
};

