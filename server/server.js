// first file to be executed
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import router from './router'
import mongoose from 'mongoose';
import cors from 'cors';

import {
  setUpContracts,
  subscribeToEvent,
  registerOraclesInContract,
  // makeTransaction,
  // respondToOracleRequest,
  // setupWeb3
} from './services/index';

const serverSetup = async (callback) => {
  
 
  
  const app = express();

  // DB Setup (connect mongoose to MonogDB localhost)

  const db = ('mongodb://localhost:oracles/oracles');
  
  try {
    await mongoose.connect(db, { useNewUrlParser: true })
    mongoose.set('useCreateIndex', true);
    console.log('MongoDB Connected...')
  } catch(err){
    console.log(err)
  }

  
  // App Setup --> to get express work the way we want it to
  
  // morgan and bodyparser are 2 middlewares in express
  // this is ue to the app.use()
  
  //middlewares:
  
  // morgan is just about login incomining requests (use for debugging)
  app.use(morgan('combined'));
  // use cors to enable requests from other domains which would be normally be blocked
  // by CORS implemented by the browser
  
  const whitelist = ['http://localhost:3000', 'http://localhost:3090']
  
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  
  app.use(cors(corsOptions));
  
  // all incoming requests are parsed as it was JSON
  app.use(bodyParser.json({ type: '*/*' }));
  
  // give access tp router.js
  router(app)

  // Server Setup --> to get out express application talk to the outside world

  // if there is a port defined then take this when not take 3090
  const port = process.env.PORT || 3090;
  const server = http.createServer(app);
  server.listen(port);
  console.log('Server listening to port', port);
  callback();
}

serverSetup( async ()=> {
  const contracts = await setUpContracts();
  subscribeToEvent(contracts);
  // registerOraclesInContract(contracts);
});
