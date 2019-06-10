const web3 = require('./web3')

import { ethers } from 'ethers';

const subscribedEvents = {}

const subscribeLogEvent =  (contract, event) => {
  const subscription = web3.eth.subscribe('logs', {
    address: contract.options.address,
    topics: event.topic
  }, (error, result) => {
      if (!error) {
        const decodedData = ethers.utils.defaultAbiCoder.decode(
          event.types,
          result.data
        );
        console.log(decodedData);
        return decodedData;
    }
    console.error(error);
  })

  subscribedEvents[event.name] = subscription

  console.log(event);
  console.log(`subscribed to event '${event.name}' of contract '${contract.options.address}' `)

}

// const unsubscribeEvent = (eventName) => {
//     subscribedEvents[eventName].unsubscribe(function(error, success){
//         if(success)
//             console.log('Successfully unsubscribed!');
//     });
// }

module.exports = {
  subscribeLogEvent
  // unsubscribeEvent
}