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
        uint balance;
    }

    struct Flight {
        bool exists;
        bool withdrawOpen;
        uint8 statusCode;
        address payable airline;
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
    event Success(string);
    event Balance(uint);
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor
        (address payable FirstAirline, uint balance)
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
    function setOpinion(address caller, bytes32 _topic, bool _opinion) internal
    requireOperational
    requireAdmin(caller)
    requireDifferentOpinion(caller, _topic, _opinion)
    returns(bool)
    {
        if (!topics[_topic].members[caller].exists) {
            topics[_topic].members[caller] = Member(true, _opinion);
            emit Success("New member of topic registered");
        } else {
            topics[_topic].members[caller].opinion = _opinion;
            emit Success("New member of topic registered");
        }
        topics[_topic].numberOfCurrentYes.add(1);
        if (topics[_topic].numberOfCurrentYes >= topics[_topic].requiredNumberOfYes) {
            topics[_topic].state = true;
            emit Success("topic state is now true");
            return true;
        } else {
            return false;
        }
        // for more complex voting if it is possible to change the opinion
        // if (_opinion){}
        // else if (!_opinion) {
        //     topics[_topic].numberOfCurrentYes.sub(1);
        //     if (topics[_topic].numberOfCurrentYes < topics[_topic].requiredNumberOfYes) {
        //         topics[_topic].state = false;
        //         emit Success("topic state is now false");
        //         return false;
        //     }
        // }
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

    function registerAirline(address payable addressOfAirline, address caller)
    external
    requireOperational
    requireAdmin(caller)
    {

        require(!airlines[addressOfAirline].isRegistered, "Airline is already registered.");
        if (numberOfAdmins < 4) {
            airlines[addressOfAirline] = Airline(true, false, 0);
            emit Success("Airline registered");
            return;
        } else {
            bytes32 airline = keccak256(abi.encodePacked(addressOfAirline));
            if (topics[airline].exists) {
                bool result = setOpinion(caller, airline, true);
                if (result) {
                    airlines[addressOfAirline] = Airline(true, false, 0);
                    emit Success("Enough admins have voted, the airline will be registered");
                } else {
                    emit Success("Voted for registration of airline");
                }
                return;
            } else {
                createNewTopic(caller, airline);
                emit Success("Created new topic for registration of a new airline and voted for it");
                return;
            }
        }
    }

    // registers a new admin
    function registerAdmin(address payable addressOfAirline) external payable
    requireOperational
    {
        require(airlines[addressOfAirline].isRegistered, "First register as Airline");
        require(!airlines[addressOfAirline].isAdmin, "Airline is already admin");
        ///@dev for testing purposes commented out
        // require(msg.value != 10 ether, "Min of 10 ether are required");
        airlines[addressOfAirline].balance = msg.value;
        airlines[addressOfAirline].isAdmin = true;
        numberOfAdmins += 1;
    }

    //register a new passenger
    function registerFlight(bytes32 _flight, address payable _airline, address payable _addressOfPassenger)
    external
    payable
    requireOperational
    {
        require(airlines[_airline].isRegistered == true, "Airline is not registered");
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
            flights[_flight].totalBalance = 1;
            flights[_flight].totalBalance.add(value);
        } else {
            flights[_flight].passengers[_addressOfPassenger].isRegistered = true;
            flights[_flight].passengers[_addressOfPassenger].balance = value;
            flights[_flight].totalBalance = 1;
            flights[_flight].totalBalance.add(value);
        }
        emit Balance(flights[_flight].passengers[_addressOfPassenger].balance);
        emit Balance(flights[_flight].totalBalance);
    }

    //deregister a new passenger
    function deregisterFlight(bytes32 _flight)
    external
    requireOperational
    {
        require(flights[_flight].exists, "Flight is not registered");
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
        require(flights[_flight].exists == true, "Flight has not been registered");
        require(flights[_flight].withdrawOpen == true, "Flight is not open for withdraw");
        require(flights[_flight].passengers[_addressOfPassenger].isRegistered == true, "You are not registered as passenger");
        require(flights[_flight].passengers[_addressOfPassenger].balance > 0, "You don't have any money secured");
        uint balanceOfPassenger = getBalanceOfPassenger(_flight, _addressOfPassenger);
        delete flights[_flight].passengers[_addressOfPassenger];
        uint totalRefund = balanceOfPassenger.mul(15).div(10);
        require(balanceOfPassenger < totalRefund, "Total Refund us not bigger than balanceOfPasseger");
        uint compensation = totalRefund.sub(balanceOfPassenger);
        address payable addressOfAirline = flights[_flight].airline;
        require(flights[_flight].totalBalance > balanceOfPassenger, "Total Balance is smaller than balanceOfPasseger");
        uint balanceOfAirline = getBalanceOfAirline(addressOfAirline);
        if (balanceOfAirline < compensation) {
            ///@dev normally this should not be the case but as the require of 10 eth is outcommented in the registerAdmin, it can be the case
            flights[_flight].totalBalance.sub(balanceOfPassenger);
            _addressOfPassenger.transfer(balanceOfPassenger);
            emit Success("Airline has not enough funds you will only get your funds back");
        } else {
            airlines[addressOfAirline].balance.sub(compensation);
            flights[_flight].totalBalance.sub(balanceOfPassenger);
            _addressOfPassenger.transfer(totalRefund);
            emit Success("You will get 1.5 more than you have insured");
        }
    }


    function getBalanceOfAirline(address payable _addressOfAirline) internal view returns(uint) {
        return airlines[_addressOfAirline].balance;
    }

    function withdrawAirlineMoney(address payable _addressOfAirline) external payable{
        ///@dev Commented out for testing purposes
        //require(airlines[_addressOfAirline].balance > 10, "You cannot withdraw money you need at least over ten ether in your account");
        require(airlines[_addressOfAirline].isRegistered == true, "Airline is not registered");
        require(airlines[_addressOfAirline].balance > 0, "You don't have any money secured");
        uint prev = getBalanceOfAirline(_addressOfAirline);
        delete airlines[_addressOfAirline];
        _addressOfAirline.transfer(prev);
    }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    function() external payable {

    }

}