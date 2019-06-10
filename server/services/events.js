// Implement all events here to subscribe to

class MyEvent  {
  constructor(name, topic, types) {
      this.name = name;
      this.topic = topic;
      this.types = types;
  }
}

// Success = new Oracle("Success", "");
const oracleRequest = new MyEvent(
  "OracleRequest", 
  ["0x3ed01f2c3fc24c6b329d931e35b03e390d23497d22b3f90e15b600343e93df11"],
  [ 'uint8', 'address', 'string', 'uint256' ]
);


module.exports = {
  oracleRequest
}