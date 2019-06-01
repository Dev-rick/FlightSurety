// used to combine our reducers

import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from './auth';
import contractReducer from './contract'

export default combineReducers({
  auth: authReducer,
  contract: contractReducer,
  form: formReducer
});
