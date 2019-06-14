import {web3WS} from './web3';
import {ethers} from 'ethers';
import config from '../config';


// only one contract is needed!!!
// 2 web3 are needed!!

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
        console.log("Catched event ", event)
        const method = require(`./eventResponses/${event.method}`)
        method(contract, decodedData);
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

export default async (contracts) => {
  for (let i = 0; i < contracts.length; i++) {
    for (let n = 0; n < config.contractsConfig[i].eventsToWatch.length; n++) {
      subscribe(contracts[i], config.contractsConfig[i].eventsToWatch[n])
    }
  }
}

