// used to combine our reducers

import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from './auth';
import contractReducer from './contract'
import flightInformationReducer from './flightInformation'

export default combineReducers({
  auth: authReducer,
  contract: contractReducer,
  flightInformation: flightInformationReducer,
  form: formReducer
});
