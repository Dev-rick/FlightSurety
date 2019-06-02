// migrating the appropriate contracts
var FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
var FlightSuretyData = artifacts.require("./FlightSuretyData.sol");

module.exports = async function(deployer) {
    const addressOfFirstAirline = '0x27D8D15CbC94527cAdf5eC14B69519aE23288B95';
    const balance = 5;
    await deployer.deploy(FlightSuretyData, addressOfFirstAirline, balance);
    const instanceOfFlightSuretyData = await FlightSuretyData.deployed();
    const addressOfFlightSuretyData = await instanceOfFlightSuretyData.address;
    await deployer.deploy(FlightSuretyApp, addressOfFlightSuretyData);
};

