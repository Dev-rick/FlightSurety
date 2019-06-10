require('./web3')
const contracts = require('./contracts')
const events = require('./events')

contracts.setup()
  .then(() => {
    events.subscribeLogEvent(contracts.list.FlightSuretyApp, 'Success')
    events.subscribeLogEvent(contracts.list.FlightSuretyApp, 'OracleRequest')
  })

  