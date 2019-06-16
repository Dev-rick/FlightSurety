//make as component

import { compose } from 'redux';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/contract';
import {ethers} from 'ethers';


class Contract extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          subscription: null,
          event: {
            dataCatched: [{
              information: ""
            }]
           }
        };
    }
    subscribeEvent(contract, event) {
        // check with web3 provider from metamask if not then use infura with a new action
        const Success = {
            name: "Success",
            topic: ['0x166b96a382dc3abc86ba052ca9c020cfd7022d2d3059e868918a3d20779e41cc'],
            types: ['string'], 
        }
        const subscription =this.props.web3.eth.subscribe('logs', {
          address: contract.address,
          topics: Success.topic
        }, async (error, result) => {
            if (!error) {
              const decodedData = ethers.utils.defaultAbiCoder.decode(
                Success.types,
                result.data
              );
              console.log("Catched event ", Success.name, decodedData)
              this.setState({
                event: {
                  dataCatched: [{
                    information: decodedData[0]
                  }]
                }
              })
              await this.componentDidMount();
              console.log(this.state.event.dataCatched.information)
              return;
          }
          console.error(error);
        })
        console.log(`subscribed to event '${Success.name}' of contract '${contract.address}' `)
        return subscription;
      }
    async componentDidMount() {
        /// Find or Inject Web3 Provider
        // calls the action creator wired up from Redux through connect
        // as a second argument, it will be callback to function which gets called when
        // the user successfully signed up
        // after function initWeb3 is successfully called the callback function of this.props.history.push is called
        await this.props.initWeb3(() => {
            console.log("Hello", this.props.web3Provider)
        });
        // Gets Metamask account
        await this.props.getMetaskAccountID(this.props.web3Provider, () => {
            console.log(this.props.metamaskAccount);
        })
        // inits contract
        await this.props.initContract(this.props.web3Provider, async (contract) => {
            console.log(contract)
        })
        let subscription;
        try{
            subscription = await this.subscribeEvent(this.props.contract, this.state.event);
            console.log(subscription);
          } catch(err) {
            console.log(err);
          }
        // Use this to search for indexes that match
        // const instance = await this.props.contract.deployed();
        // console.log(instance);
        
    }



    render() {
        return (
            <span></span>
        )
      }
}

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
        web3: state.contract.web3,
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