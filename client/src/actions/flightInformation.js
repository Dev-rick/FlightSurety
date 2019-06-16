import { FLIGHT } from './types';

export const setFlightInformation = (flight, callback) => async dispatch => {
        dispatch({
            type: FLIGHT,
            payload: flight
        })
        // Retrieving accounts
    callback();
}