const web3 = require('./web3')

const subscribedEvents = {}

const subscribeLogEvent = (contract, eventName) => {
  // const eventJsonInterface = web3.utils._.find(
  //   contract._jsonInterface,
  //   o => o.name === eventName && o.type === 'event',
  // )

  
  const subscription = web3.eth.subscribe('logs', {
    address: contract.options.address,
    topics: ["0x3ed01f2c3fc24c6b329d931e35b03e390d23497d22b3f90e15b600343e93df11"]
  }, (error, result) => {
      if (!error) {
        // works!!!!
        // decode raw data
        // receipt = web3.eth.getTransactionReceipt(result.transactionHash)
        // logs = my_contract.events.eventName().processReceipt(receipt)
        console.log(logs);

        return;
    }

    console.error(error);
  })
  .on("data", function(blockHeader){
    console.log(blockHeader);
  })
  .on("error", console.error);

  subscribedEvents[eventName] = subscription

  console.log(`subscribed to event '${eventName}' of contract '${contract.options.address}' `)

}

const unsubscribeEvent = (eventName) => {
    subscribedEvents[eventName].unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });
}

module.exports = {
  subscribeLogEvent,
  unsubscribeEvent
}