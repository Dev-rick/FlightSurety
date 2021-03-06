pragma solidity ^0.5.8;

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */

contract FlightSuretyApp {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    bool operational;
    address private contractOwner; // Account used to deploy contract
    FlightSuretyData flightSuretyData;

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 2;

    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;
    }

    struct ResponseInfo {
        address requester; // Account that requested status
        bool isOpen; // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses; // Mapping key is the status code reported
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    event DefaultOracleRegistered(address oracle, uint8 firstIndex, uint8 secondIndes, uint8 thirdIndex);
    event OracleRegistered(address oracle, uint8 firstIndex, uint8 secondIndes, uint8 thirdIndex);
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);
    event Success(string topic);
    event Fail(string topic);


    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    constructor
        (address dataContract)
    public {
        contractOwner = msg.sender;
        flightSuretyData = FlightSuretyData(dataContract);
        operational = true;
      }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireOperational() {
        require(operational, "Contract is not operational");
        _;
    }

    /********************************************************************************************/
    /*                                      INTERNAL UTILITY FUNCTIONS                          */
    /********************************************************************************************/

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes(
        address account
    )
    internal
    requireOperational
    returns(uint8[3] memory) {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);

        indexes[1] = indexes[0];
        while (indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while ((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex(
        address account
    )
    internal
    requireOperational
    returns(uint8) {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0; // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

    /********************************************************************************************/
    /*                           FLIGHTSURETYDATA CONTRACT FUNCTIONS                            */
    /********************************************************************************************/

    function setOperationalStatusOfDataContract(bool operationalStatus) external
    requireOperational
    {
        address caller = msg.sender;
        flightSuretyData.setOperationalStatus(operationalStatus, caller);
        emit Success("Operational status set");
    }

    function registerAirline(address payable _addressOfAirline)
    external
    requireOperational
    {
        address payable caller = msg.sender;
        flightSuretyData.registerAirline(_addressOfAirline, caller);
        emit Success("Airline registered");
    }

    function registerAdmin() external
    payable
    requireOperational
    {
        require(msg.value != 0 wei, "Not enough money send");
        address payable addressOfAirline = msg.sender;
        uint256 amountSent = msg.value;
        flightSuretyData.registerAdmin.value(amountSent)(addressOfAirline);
        emit Success("Admin registered");
    }

    function registerFlight(
        string calldata _flight,
        address payable _airline,
        uint256 _timestamp
        )
    external
    payable
    requireOperational
    {
        require(msg.value != 0 wei, "Not enough money send");
        require(msg.value < 1 ether, "Too much money send");
        address payable _addressOfPassenger = msg.sender;
        bytes32 flight = keccak256(abi.encodePacked(_flight, _timestamp));
        flightSuretyData.registerFlight.value(msg.value)(flight, _airline, _addressOfPassenger);
    }

    function deregisterFlight(bytes32 _flight) internal
    requireOperational
    {
        flightSuretyData.deregisterFlight(_flight);
        emit Success("Derigistration of flight successful");
    }

    function getFlightWithdrawStatus(bytes32 _flight) internal view
    requireOperational
    returns(bool)
    {
        bool status = flightSuretyData.getFlightWithdrawStatus(_flight);
        return status;
    }

    function openWithdrawForFlight(bytes32 _flight) internal
    requireOperational
    {
        flightSuretyData.openWithdrawForFlight(_flight);
        emit Success("Withdrawing now open for flight");
    }

    function withdrawPassengerMoney(bytes32 _flight, address payable _addressOfPassenger) internal
    requireOperational
    {
        flightSuretyData.withdrawPassengerMoney(_flight, _addressOfPassenger);
        emit Success("Withdrawing successfull");
    }

    function withdrawAirlineMoney(address payable _addressOfAirline) external payable {
        flightSuretyData.withdrawAirlineMoney(_addressOfAirline);
        emit Success("Withdrawing successfull");
    }

    function getBalance() external returns(uint256){
        uint256 balance = flightSuretyData.getBalance();
        emit Success("Balance retrieved");
        return balance;
    }

    /********************************************************************************************/
    /*                            EXTERNAL SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    // get operational status
    function isOperational()
    public
    view
    returns(bool) {
        return operational;
    }

    // Set operational status (only contract owner)
    function setOperationalStatus(bool operationalStatus) external
    requireContractOwner
    {
        operational = operationalStatus;
    }

    function processFlightStatus(
        string memory _flight,
        uint256 _timestamp,
        uint8 statusCode
    )
    internal
    requireOperational{
        bytes32 flight = keccak256(abi.encodePacked(_flight, _timestamp));
        if (statusCode == 20) {
            openWithdrawForFlight(flight);
        } else {
            deregisterFlight(flight);
        }
    }

    function withdrawMoney(string calldata _flight, uint256 _timestamp) external
    payable
    requireOperational
    {
        bytes32 flight = keccak256(abi.encodePacked(_flight, _timestamp));
        address payable addressOfPassenger = msg.sender;
        withdrawPassengerMoney(flight, addressOfPassenger);
    }

    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus(
        address airline,
        string calldata _flight,
        uint256 _timestamp
    )
    external
    {
        bytes32 flight = keccak256(abi.encodePacked(_flight, _timestamp));
        bool withdrawStatus = getFlightWithdrawStatus(flight);
        if (withdrawStatus) {
            emit FlightStatusInfo(airline, _flight, _timestamp, 20);
        } else {
            uint8 index = getRandomIndex(msg.sender);
            // Generate a unique key for storing the request
            bytes32 key = keccak256(abi.encodePacked(index, airline, _flight, _timestamp));
            oracleResponses[key] = ResponseInfo({
                requester: msg.sender, isOpen: true
            });
            emit OracleRequest(index, airline, _flight, _timestamp);
        }
    }

    // Register default oracles with the contract
    function registerDefaultOracles(address _oracle)
    external
    requireOperational
    requireContractOwner
    {
        // No registration fee required
        require(!oracles[_oracle].isRegistered, "Oracle is already registered.");
        uint8[3] memory indexes = generateIndexes(_oracle);
        oracles[_oracle] = Oracle({
            isRegistered: true, indexes: indexes
        });
        emit DefaultOracleRegistered(_oracle, indexes[0], indexes[1], indexes[2]);
    }

    // Register new oracle
    function registerOracle()
    external
    payable
    requireOperational
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
            isRegistered: true, indexes: indexes
        });
        emit OracleRegistered(msg.sender, indexes[0], indexes[1], indexes[2]);
    }

    function getMyIndexes()
    external
    view
    requireOperational
    returns(uint8[3] memory) {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }

    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse(
        uint8 index,
        address airline,
        string calldata flight,
        uint256 timestamp,
        uint8 statusCode
    )
    external
    requireOperational
    {
        ///@dev for test reason com this is in a comment
        require(
            (oracles[msg.sender].indexes[0] == index)
            || (oracles[msg.sender].indexes[1] == index)
            || (oracles[msg.sender].indexes[2] == index),
            "Index does not match oracle request"
        );
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");
        oracleResponses[key].responses[statusCode].push(msg.sender);
        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        //emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length == MIN_RESPONSES) {
            oracleResponses[key].isOpen = false;
            // Handle flight status as appropriate
            processFlightStatus(flight, timestamp, statusCode);
            emit FlightStatusInfo(airline, flight, timestamp, statusCode);
        } else {
            emit Success("One response has been made");
        }
    }

}

contract FlightSuretyData {
    function setOperationalStatus(bool operationalStatus, address caller) external;
    function registerAirline(address payable addressOfAirline, address caller) external;
    function registerAdmin(address payable addressOfAirline) external payable;
    function registerFlight(
        bytes32 flight,
        address payable _airline,
        address payable _addressOfPassenger
        ) external payable;
    function deregisterFlight(bytes32 _flight) external;
    function openWithdrawForFlight(bytes32 _flight) external;
    function getFlightWithdrawStatus(bytes32 _flight) external view returns(bool);
    function withdrawPassengerMoney(bytes32 _flight, address payable _addressOfPassenger) external payable;
    function withdrawAirlineMoney(address payable _addressOfAirline) external payable;
    function getBalance() public view returns (uint256);
}