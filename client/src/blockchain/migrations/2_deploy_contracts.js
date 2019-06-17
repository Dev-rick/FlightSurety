// migrating the appropriate contracts
var FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
var FlightSuretyData = artifacts.require("./FlightSuretyData.sol");
const fs = require('fs');

module.exports = async function(deployer) {
    // For testing: Make sure its your address of addressOfFirstAirline 
    const addressOfFirstAirline = '0x0be3dCDC09881e9e0773ce9287061Ff803A38d3d';
    const balance = 0;
    await deployer.deploy(FlightSuretyData, addressOfFirstAirline, balance);
    const instanceOfFlightSuretyData = await FlightSuretyData.deployed();
    const addressOfFlightSuretyData = await instanceOfFlightSuretyData.address;
    await deployer.deploy(FlightSuretyApp, addressOfFlightSuretyData);
    const instanceOfFlightSuretyApp = await FlightSuretyData.deployed();
    const addressOfFlightSuretyApp = await instanceOfFlightSuretyApp.address;
    let config = {
        migrationAddresses: {
            dataAddress: addressOfFlightSuretyData,
            appAddress: addressOfFlightSuretyApp
        }
    }

    fs.writeFileSync(__dirname + 'config.json',JSON.stringify(config, null, '\t'), 'utf-8');
};

