pragma solidity ^0.5.8;

import "./SafeMath.sol";

contract FlightSuretyData {
    using SafeMath
    for uint;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    uint256 numberOfAdmins = 0;
    bool operational;

    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

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

    struct Flight {
        bool exists;
        bool withdrawOpen;
        uint8 statusCode;
        address airline;
        uint totalBalance;
        mapping(address => Passenger) passengers;
    }

    struct Passenger {
        bool isRegistered;
        uint balance;
    }

    mapping(address => Airline) public airlines;   // Mapping for storing Airline profiles
    mapping(bytes32 => Flight) public flights;   // Mapping for storing Passenger profiles
    mapping(bytes32 => Topic) public topics;
    event Success();
    event Balance(uint);
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
        airlines[FirstAirline] = Airline(true, true, balance);
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
        require(airlines[caller].isAdmin, "Caller is not an Admin");
        _;
    }

    //checks operationalstatus
    modifier requireOperational() {
        require(operational, "Contract is not operational");
        _;
    }

    // Modifier which verifies if multi-consensus
    modifier requireMConsensus(bytes32 _topic) {
        // require that the operational state is different from his opinion before
        require(topics[_topic].state, "Consensus is not yet reached");
        _;
    }

    modifier requireDifferentOpinion(address caller, bytes32 _topic, bool _opinion) {
         require(topics[_topic].members[caller].opinion != _opinion, "Your opinion did not change");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function createNewTopic(address caller, bytes32 _topic) internal
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
    function setOpinion(address caller, bytes32 _topic, bool _opinion) external
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

    function getOpinion(address caller, bytes32 _topic)
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
        require(!airlines[addressOfAirline].isRegistered, "Airline is already registered.");
        if (numberOfAdmins < 5) {
            airlines[addressOfAirline] = Airline(true, false, 0);
        } else {
            bytes32 airline = keccak256(abi.encodePacked(addressOfAirline));
            require(topics[airline].exists, "Topic does already exists, please vote");
            createNewTopic(caller, airline);
        }
    }

    // registers a new admin
    function registerAdmin(address addressOfAirline) external payable
    requireOperational
    {
        require(airlines[addressOfAirline].isRegistered, "First register as Airline");
        require(!airlines[addressOfAirline].isAdmin, "Airline is already admin");
        require(msg.value != 10 ether, "Min of 10 ether are required");
        airlines[addressOfAirline].balance = msg.value;
        airlines[addressOfAirline].isAdmin = true;
        numberOfAdmins += 1;
    }

    //register a new passenger
    function registerFlight(bytes32 _flight, address _airline, address payable _addressOfPassenger)
    external
    payable
    requireOperational
    {
        require(msg.value > 0 wei, "You did not send any money along");
        require(!flights[_flight].passengers[_addressOfPassenger].isRegistered, "You have already insured against this flight");
        uint value = msg.value;
        if (!flights[_flight].exists) {
            flights[_flight].exists = true;
            flights[_flight].withdrawOpen = false;
            flights[_flight].statusCode = STATUS_CODE_UNKNOWN;
            flights[_flight].airline = _airline;
            flights[_flight].passengers[_addressOfPassenger].isRegistered = true;
            flights[_flight].passengers[_addressOfPassenger].balance = value;
            flights[_flight].totalBalance.add(value);
        } else {
            flights[_flight].passengers[_addressOfPassenger].isRegistered = true;
            flights[_flight].passengers[_addressOfPassenger].balance = value;
            flights[_flight].totalBalance.add(value);
        }
        emit Balance(flights[_flight].passengers[_addressOfPassenger].balance);
    }

    //deregister a new passenger
    function deregisterFlight(bytes32 _flight)
    external
    requireOperational
    {
        require(flights[_flight].exists, "Flight is already deleted");
        uint sum = flights[_flight].totalBalance;
        airlines[flights[_flight].airline].balance = sum;
        delete flights[_flight];
    }

    //open withdraw for flight
    function openWithdrawForFlight(bytes32 _flight)
    external
    requireOperational
    {
        flights[_flight].withdrawOpen = true;
    }

    function getFlightWithdrawStatus(bytes32 _flight)
    external view
    requireOperational
    returns(bool)
    {
        return flights[_flight].withdrawOpen;

    }

    function getBalanceOfPassenger(bytes32 flight, address payable addressOfPassenger) internal view returns(uint) {
        return flights[flight].passengers[addressOfPassenger].balance;
    }

    function withdrawPassengerMoney(bytes32 _flight, address payable _addressOfPassenger) external payable{
        require(flights[_flight].exists = true, "Flight does not exists");
        require(flights[_flight].withdrawOpen = true, "Flight is not open for withdraw");
        require(flights[_flight].passengers[_addressOfPassenger].isRegistered = true, "You are not registered as passenger");
        // require(flights[_flight].passengers[_addressOfPassenger].balance > 0, "You don't have any money secured");
        uint prev = getBalanceOfPassenger(_flight, _addressOfPassenger);
        delete flights[_flight].passengers[_addressOfPassenger];
        _addressOfPassenger.transfer(prev);
        emit Balance(prev);

    }

    function() external payable {

    }

    // function withdrawAirlineMoney(address _addressOfAirline) external payable{
    //     require(airlines[_addressOfAirline].balance > 10, "You cannot withdraw money you need at least over ten ether in your account");

    // }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */

}