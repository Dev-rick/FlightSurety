import web3 from './web3';
import {respondToOracleRequest} from './oracleResponse';
import { ethers } from 'ethers';


const subscribeLogEvent =  (contract, event) => {
  web3.eth.subscribe('logs', {
    address: contract.options.address,
    topics: event.topic
  }, (error, result) => {
      if (!error) {
        const decodedData = ethers.utils.defaultAbiCoder.decode(
          event.types,
          result.data
        );
        console.log(decodedData);
        let indexRequested = decodedData[0];
        respondToOracleRequest(indexRequested);
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

module.exports = {
  subscribeLogEvent
  // unsubscribeEvent
}