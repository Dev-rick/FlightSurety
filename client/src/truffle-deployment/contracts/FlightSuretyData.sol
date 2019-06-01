pragma solidity ^0.5.8;

import "./SafeMath.sol";

contract FlightSuretyData {
    using SafeMath
    for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bytes32 private HashOfContracteOwner;
    uint256 numberOfAdmins = 0;

    struct Topic {
        bool state;
        mapping(bytes32 => Member) members;
        uint256 numberOfCurrentYes;
        uint requiredNumberOfYes;
    }

    struct Member {
        bool exists;
        bool opinion;
    }

    struct UserProfile {
        bool isRegistered;
        bool isAirline;
        bool isAdmin;
        bool isPassenger;
        uint256 balance;
    }

    mapping(address => UserProfile) userProfiles;   // Mapping for storing user profiles
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
        ()
    public {
        contractOwner = msg.sender;
        userProfiles[contractOwner] = UserProfile(true, true, true, false, 0);
        // initiate all topics with a requiredNumberOfYes of 1
        HashOfContracteOwner = keccak256(abi.encodePacked(msg.sender));
            /**
                * @dev Modifier that requires the "operational" boolean variable to be "true"
                *      This is used on all state changing functions to pause the contract in
                *      the event there is an issue that needs to be fixed
            */
        topics["operational"].state = true;
        topics["operational"].members[HashOfContracteOwner] = Member(true, true);
        topics["operational"].numberOfCurrentYes = 1;
        topics["operational"].requiredNumberOfYes = numberOfAdmins * 33 / 100;
        topics["registerNewAirlines"].state = true;
        topics["registerNewAirlines"].members[HashOfContracteOwner] = Member(true, true);
        topics["registerNewAirlines"].numberOfCurrentYes = 1;
        topics["registerNewAirlines"].requiredNumberOfYes = numberOfAdmins * 33 / 100;
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
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    // Checks if msg.sender is an Admin
    modifier requireAdmin(){
        require(userProfiles[msg.sender].isAdmin, "Caller is not an Admin");
        _;
    }

    // Modifier which verifies if multi-consensus
    modifier requireMConsensus(string memory _topic) {
        // require that the operational state is different from his opinion before
        require(topics[_topic].state, "Consensus is not yet reached");
        _;
    }

    modifier requireDifferentOpinion(string memory _topic, bool _opinion) {
        address caller = msg.sender;
        bytes32 HashOfCaller = keccak256(abi.encodePacked(caller));
        require(topics[_topic].members[HashOfCaller].opinion != _opinion, "Your opinion did not change");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    // Setting an opinion
    function setOpinion(string calldata _topic, bool _opinion) external
    requireAdmin
    requireDifferentOpinion(_topic, _opinion)
    {
        address caller = msg.sender;
        bytes32 HashOfCaller = keccak256(abi.encodePacked(caller));
        if (!topics[_topic].members[HashOfCaller].exists) {
            topics[_topic].members[HashOfCaller] = Member(true, _opinion);
            emit Success();
        } else if (topics[_topic].members[HashOfCaller].exists) {
            if (topics[_topic].members[HashOfCaller].opinion != _opinion) {
                topics[_topic].members[HashOfCaller].opinion = _opinion;
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



    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function registerUser(address addressOfUser, bool Airline)
    external
    requireMConsensus("operational")
    requireMConsensus("registerNewAirlines")
    {
        require(!userProfiles[addressOfUser].isRegistered, "User is already registered.");
        if (Airline) {
            userProfiles[addressOfUser] = UserProfile(true, true, false, false, 0);
        }
        else if (!Airline) {
            userProfiles[addressOfUser] = UserProfile(true, false, false, true, 0);
        }
    }

    // registers a new admin
    function registerAdmin(address addressOfUser) external payable
    requireMConsensus("operational")
    {
        require(userProfiles[addressOfUser].isRegistered, "First register as user");
        require(userProfiles[addressOfUser].isAirline, "First register as user");
        require(!userProfiles[addressOfUser].isAdmin, "User is already admin");
        require(msg.value != 10 ether, "Min of 10 ether are required");
        userProfiles[addressOfUser].balance = msg.value;
        userProfiles[addressOfUser].isAdmin = true;
    }

    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy()
    external
    payable
    requireMConsensus("operational")
    {

    }

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees()
    external
    requireMConsensus("operational")
    {}


    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay()
    external
    requireMConsensus("operational")
    {}

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund()
    public
    payable
    requireMConsensus("operational")
    {}

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    )
    internal
    view
    requireMConsensus("operational")
    returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function checkConsensus (string calldata _topic) external view
    requireMConsensus(_topic)
    returns(bool) {
        return(
            true
        );
    }
    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    function ()
    external
    payable
    requireMConsensus("operational")
    {
        fund();
    }



}