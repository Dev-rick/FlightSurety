// used to combine our reducers

import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';

import contractReducer from './contract'
import flightInformationReducer from './flightInformation'

export default combineReducers({
  contract: contractReducer,
  flightInformation: flightInformationReducer,
  form: formReducer
});
