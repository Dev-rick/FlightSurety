import {web3WS} from './web3';
import {ethers} from 'ethers';
import {contractsConfig} from '../config';

const subscribe = (contract, event) => {
  web3WS.eth.subscribe('logs', {
    address: contract.options.address,
    topics: event.topic
  }, (error, result) => {
      if (!error) {
        const decodedData = ethers.utils.defaultAbiCoder.decode(
          event.types,
          result.data
        );
        console.log(decodedData);
        console.log(event)
        event.method(decodedData);
        return;
    }
    console.error(error);
  })
  console.log(`subscribed to event '${event.name}' of contract '${contract.options.address}' `)
}

// const unsubscribeEvent = (eventName) => {
//     subscribedEvents[eventName].unsubscribe(function(error, success){
//         if(success)
//             console.log('Successfully unsubscribed!');
//     });
// }

const subscribeToEvent = async (contracts) => {
  for (let i = 0; i < contracts.length; i++) {
    for (let n = 0; n < contractsConfig[i].eventsToWatch.length; n++) {
      subscribe(contracts[i], contractsConfig[i].eventsToWatch[n])
    }
  }
}

module.exports = {
  subscribeToEvent
  // unsubscribeEvent
}