pragma solidity ^0.5.8;

import "./SafeMath.sol";

contract FlightSuretyData {
    using SafeMath
    for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    uint256 numberOfAdmins = 0;
    bool operational;

    struct Topic {
        bool exists;
        bool state;
        mapping(address => Member) members;
        uint256 numberOfCurrentYes;
        uint requiredNumberOfYes;
    }

    struct Member {
        bool exists;
        bool opinion;
    }

    struct Airline {
        bool isRegistered;
        bool isAdmin;
        uint256 balance;
    }

    struct Passenger {
        bool isRegistered;
        string flight;
        uint256 balance;
    }

    mapping(address => Airline) Airlines;   // Mapping for storing Airline profiles
    mapping(address => Passenger) Passengers;   // Mapping for storing Passenger profiles
    mapping(string => Topic) topics;
    event Success();
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor
        (address FirstAirline, uint256 balance)
    public {
        contractOwner = msg.sender;
        Airlines[FirstAirline] = Airline(true, true, balance);
        operational = true;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     *      This is used on all state changing functions to pause the contract in
     *      the event there is an issue that needs to be fixed
     */
    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner(address caller) {
        require(caller == contractOwner, "Caller is not contract owner");
        _;
    }

    // Checks if caller is an Admin
    modifier requireAdmin(address caller){
        require(Airlines[caller].isAdmin, "Caller is not an Admin");
        _;
    }

    //checks operationalstatus
    modifier requireOperational() {
        require(operational, "Contract is not operational");
        _;
    }

    // Modifier which verifies if multi-consensus
    modifier requireMConsensus(string memory _topic) {
        // require that the operational state is different from his opinion before
        require(topics[_topic].state, "Consensus is not yet reached");
        _;
    }

    modifier requireDifferentOpinion(address caller, string memory _topic, bool _opinion) {
         require(topics[_topic].members[caller].opinion != _opinion, "Your opinion did not change");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function createNewTopic(address caller, string memory _topic) internal
    requireOperational
    {
        topics[_topic].members[caller] = Member(true, true);
        topics[_topic].exists = true;
        topics[_topic].numberOfCurrentYes = 1;
        topics[_topic].requiredNumberOfYes = numberOfAdmins.mul(50).div(100);
    }

    function toString(address x) internal pure returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }


    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    // Get balance of account
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }


    // setting operational status
    function setOperationalStatus(bool operationalStatus,address caller) external requireAdmin(caller){
        operational = operationalStatus;
    }

    // Setting an opinion
    function setOpinion(address caller, string calldata _topic, bool _opinion) external
    requireOperational
    requireAdmin(caller)
    requireDifferentOpinion(caller, _topic, _opinion)
    {
        if (!topics[_topic].members[caller].exists) {
            topics[_topic].members[caller] = Member(true, _opinion);
            emit Success();
        } else if (topics[_topic].members[caller].exists) {
            if (topics[_topic].members[caller].opinion != _opinion) {
                topics[_topic].members[caller].opinion = _opinion;
            }
        }
        if (_opinion) {
            topics[_topic].numberOfCurrentYes += 1;
            if (topics[_topic].numberOfCurrentYes >= topics[_topic].requiredNumberOfYes) {
                topics[_topic].state = true;
            }
        }
        else if (!_opinion) {
            topics[_topic].numberOfCurrentYes -= 1;
            if (topics[_topic].numberOfCurrentYes < topics[_topic].requiredNumberOfYes) {
                topics[_topic].state = false;
            }
        }
    }

    function getOpinion(address caller, string calldata _topic)
    external
    view
    requireOperational
    returns(uint256 currentNumberOfYes,uint256 requiredNumberOfYes, bool myOpinion){
        return(
            currentNumberOfYes = topics[_topic].numberOfCurrentYes,
            requiredNumberOfYes = topics[_topic].requiredNumberOfYes,
            myOpinion = topics[_topic].members[caller].opinion
        );
    }

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */

    function registerAirline(address addressOfAirline, address caller)
    external
    requireOperational
    requireAdmin(caller)
    {
        require(!Airlines[addressOfAirline].isRegistered, "Airline is already registered.");
        if (numberOfAdmins < 5) {
            Airlines[addressOfAirline] = Airline(true, false, 0);
        } else {
            string memory stringOfAirline = toString(addressOfAirline);
            require(topics[stringOfAirline].exists, "Topic does already exists, please vote");
            createNewTopic(caller, stringOfAirline);
        }
    }

    // registers a new admin
    function registerAdmin(address addressOfAirline, uint256 amountSent) external payable
    requireOperational
    {
        require(Airlines[addressOfAirline].isRegistered, "First register as Airline");
        require(!Airlines[addressOfAirline].isAdmin, "Airline is already admin");
        require(amountSent != 10 ether, "Min of 10 ether are required");
        Airlines[addressOfAirline].balance = amountSent;
        Airlines[addressOfAirline].isAdmin = true;
        numberOfAdmins += 1;
    }

    //register a new passenger
    function registerPassenger(address addressOfPassenger, string calldata flight, uint256 amountSent)
    external
    payable
    requireOperational
    {
        require(!Passengers[addressOfPassenger].isRegistered, "Passenger is already registered.");
        Passengers[addressOfPassenger] = Passenger(true, flight, amountSent);
    }

    //deregister a new passenger
    function deregisterPassenger(address addressOfPassenger)
    external
    requireOperational
    {
        require(Passengers[addressOfPassenger].isRegistered, "Passenger is already deleted");
        require(Passengers[addressOfPassenger].balance == 0, "Please withdraw first the money");
        delete Passengers[addressOfPassenger];
    }
    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy()
    external
    payable
    requireOperational
    {

    }

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees()
    external
    requireOperational
    {}


    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay()
    external
    requireOperational
    {}

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund()
    public
    payable
    requireOperational
    {}

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    )
    internal
    view
    requireOperational
    returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    function ()
    external
    payable
    requireOperational
    {
        fund();
    }



}