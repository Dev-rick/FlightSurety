import web3 from './web3';

const subscribeToPendingTransactions = () => {
  web3.eth.subscribe('pendingTransactions', {address: '0x27D8D15CbC94527cAdf5eC14B69519aE23288B95'}, (error, result) => {
      if (!error) {
        console.log(result);
    }
    console.error(error);
  })
  .on("data", function(transaction){
    console.log(transaction);
    });

}

// const unsubscribeEvent = (eventName) => {
//     subscribedEvents[eventName].unsubscribe(function(error, success){
//         if(success)
//             console.log('Successfully unsubscribed!');
//     });
// }

module.exports = {
    subscribeToPendingTransactions
  // unsubscribeEvent
}