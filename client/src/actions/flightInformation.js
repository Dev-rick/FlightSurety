import { FLIGHT, TIMESTAMP } from './types';

export const setFlightInformation = (flight, timestamp, callback) => async dispatch => {
        dispatch({
            type: FLIGHT,
            payload: flight
        })

        dispatch({
            type: TIMESTAMP,
            payload: timestamp
        })
        // Retrieving accounts
    callback();
}