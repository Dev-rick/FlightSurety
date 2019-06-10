// helps us to setup the passport library in order to handle requests visiting
// sites requiring authentication

import Oracle from '../models/oracle';

const responses = {
    STATUS_CODE_UNKNOWN : 0,
    STATUS_CODE_ON_TIME : 10,
    STATUS_CODE_LATE_AIRLINE : 20,
    STATUS_CODE_LATE_WEATHER : 30,
    STATUS_CODE_LATE_TECHNICAL : 40,
    STATUS_CODE_LATE_OTHER : 50
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const generateRandomResponse = () => {
    let arrayOfResponses = Object.values(responses);
    let randomindex = getRandomInt(5);
    return arrayOfResponses[randomindex]
} 

const respondToOracleRequest = (requestedIndex) => {
    Oracle.find()
    .then((res) => {
        res.forEach((oracle) => {
            console.log(oracle);
            oracle.compareIndexes(requestedIndex, (res) => {
                console.log(generateRandomResponse());
                let randomResponse = generateRandomResponse();
                console.log(randomResponse);
                // SEND INFORMATION TO THE CLIENT SO METAMASK CAN ACCEPT IT
            })
        })
    })
}

module.exports = {
    respondToOracleRequest
}