// migrating the appropriate contracts
var FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
var FlightSuretyData = artifacts.require("./FlightSuretyData.sol");

module.exports = async function(deployer) {
    await deployer.deploy(FlightSuretyData);
    const instanceOfFlightSuretyData = await FlightSuretyData.deployed();
    const addressOfFlightSuretyData = await instanceOfFlightSuretyData.address;
    await deployer.deploy(FlightSuretyApp, addressOfFlightSuretyData);
};

