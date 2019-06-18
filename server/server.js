import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import {
  setUpContracts,
  subscribeToEvent,
  registerOraclesInContract
} from './services/index';

const serverSetup = async (callback) => {
    
  const app = express();
  const db = ('mongodb://localhost:oracles/oracles');
  const port = process.env.PORT || 3090;
  const server = http.createServer(app);
  const whitelist = ['http://localhost:3000', 'http://localhost:3090']
  
  try {
    await mongoose.connect(db, { useNewUrlParser: true })
    mongoose.set('useCreateIndex', true);
    console.log('MongoDB Connected...')
  } catch(err){
    console.log(err)
  }
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
  app.use(bodyParser.json({ type: '*/*' }));
  server.listen(port);
  console.log('Server listening to port', port);
  callback();
}

serverSetup( async ()=> {
  const contracts = await setUpContracts();
  subscribeToEvent(contracts);
  registerOraclesInContract(contracts);
});
