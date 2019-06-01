//make as component

import { compose } from 'redux';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/contract';

class Contract extends Component {
    state = {
        // web3Provider: null,
        contract: {},
        // owner: null,
        // users: [],
        // airlines: [],
        // admins: [],
        // passengers: [],

        // insert here all from supply Chain App.js!!!
        // insert the dist version of truffle-contract in the html
    }
    async componentDidMount() {
        /// Find or Inject Web3 Provider
        // calls the action creator wired up from Redux through connect
        // as a second argument, it will be callback to function which gets called when
        // the user successfully signed up
        // after function initWeb3 is successfully called the callback function of this.props.history.push is called
        await this.props.initWeb3(window, () => {
            console.log("Hello", this.props.web3Provider)
        });

        // Gets Metamask account
        await this.props.getMetaskAccountID(this.props.web3Provider, () => {
            console.log(this.props.metamaskAccount);
        })
        // inits contract
        await this.props.initContract(this.props.web3Provider, async () => {
            this.setState({contract: this.props.contract})
            this.props.contract.setProvider(this.props.web3Provider);
            //this.props.history.push('/');
        })
        const instance = await this.props.contract.deployed();
        console.log(instance);
        
    }
    render() {
        return (
            <span></span>
        )
      }
}

// export default class Contract {
//     constructor(network, callback) {

//         let config = Config[network];
//         this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
//         this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
//         this.initialize(callback);
//         this.owner = null;
//         this.airlines = [];
//         this.passengers = [];
//     }

//     initialize(callback) {
//         this.web3.eth.getAccounts((error, accts) => {
           
//             this.owner = accts[0];

//             let counter = 1;
            
//             while(this.airlines.length < 5) {
//                 this.airlines.push(accts[counter++]);
//             }

//             while(this.passengers.length < 5) {
//                 this.passengers.push(accts[counter++]);
//             }

//             callback();
//         });
//     }

//     isOperational(callback) {
//        let self = this;
//        self.flightSuretyApp.methods
//             .isOperational()
//             .call({ from: self.owner}, callback);
//     }

//     fetchFlightStatus(flight, callback) {
//         let self = this;
//         let payload = {
//             airline: self.airlines[0],
//             flight: flight,
//             timestamp: Math.floor(Date.now() / 1000)
//         } 
//         self.flightSuretyApp.methods
//             .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
//             .send({ from: self.owner}, (error, result) => {
//                 callback(error, payload);
//             });
//     }
// }


// receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
    return { 
        web3Provider: state.contract.web3Provider,
        metamaskAccount: state.contract.metamaskAccount,
        contract: state.contract.contract
    }
  }

export default compose(
  //put in here all HOC you want to use:
  // null --> no state wired up here
  connect(mapStateToProps, actions),
  
)(Contract);