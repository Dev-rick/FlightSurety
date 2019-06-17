import { compose } from 'redux';
import React, {Component} from 'react';
import {Container, Button, Form, Col, InputGroup} from 'react-bootstrap';
import { connect } from 'react-redux';
import {ethers} from 'ethers';
import WithdrawModal from './WithdrawModal'
import LoadingFlightCheckModal from './LoadingFlightCheckModal';
import NoCompensationModal from './NoCompensationModal';
import * as actions from '../../actions/flightInformation';

class CheckFlight extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
        flight: "",
        airline: "",
        timestamp: ""
      },
      subscription: null,
      event: {
        dataCatched: {
          airline: "",
          flight: "",
          timestamp: "",
          statusCode: ""
        }
       },
       waitingModal: false,
       withdrawModalshow: false,
       noCompensationModal: false
      }
    };
    
    
  subscribeEvent = async (contract, event) => {
    // check with web3 provider from metamask if not then use infura with a new action
    const FlightStatusInfo = {
        name: "FlightStatusInfo",
        topic: ['0xe23f5229de535c091e3b7bec2665f5d698192d3b31393066e8987b7a05076b6c'],
        types: ['address', 'string', 'uint256', 'uint8'], 
    }
    const subscription = this.props.web3.eth.subscribe('logs', {
      address: contract.address,
      topics: FlightStatusInfo.topic
    }, (error, result) => {
      if (!error) {
        const data = result.data;
        console.log(data)
        const decodedData = ethers.utils.defaultAbiCoder.decode(
          FlightStatusInfo.types,
          result.data
          );
          console.log("Catched event ", event)
          this.setState({
            event: {
              dataCatched: {
                airline: decodedData[0],
                flight: decodedData[1],
                timestamp: decodedData[2],
                statusCode: decodedData[3]
              }
            }
          })
          console.log(this.state.event.dataCatched)
          subscription.unsubscribe(function(error, success){
            if(success)
                  console.log('Successfully unsubscribed!');
                });
          if (this.state.event.dataCatched.statusCode === 20) {
            this.setState({
              waitingModal: false, 
              withdrawModalshow: true
            })
          } else {
            this.setState({
              waitingModal: false, 
              noCompensationModal: true
            })
          }
          this.clearForm();
          // make if 20 a withdraw button appear
          return;
      }
      console.error(error);
    })
    console.log(`subscribed to event '${FlightStatusInfo.name}' of contract '${contract.address}' `)
    return subscription;
  }

  handleFormChange = (event) => {
    const form = event.currentTarget;
    this.setState({   
      form: {
        flight: form.flight.value,
        airline: form.airline.value,
        timestamp: form.timestamp.value
      }
    });
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
      form: {
        flight: "",
        airline: "",
        timestamp: ""
       },
       subscription: null,
       event: {
         dataCatched: {
          airline: "",
          flight: "",
          timestamp: "",
          statusCode: ""
         }
       }
    });
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.checkFlight(event, this.clearForm)
    }
    this.setState({ validated: true });
  }


  checkFlight = async (event, callback) => {
    event.preventDefault();
    console.log(this.state.form.flight);
      const flight = this.state.form.flight.toString();
      const airline = this.state.form.airline.toString();
      const updatedTimestamp = Number(this.state.form.timestamp.split("-").join(""));
      await this.props.setFlightInformation(flight, updatedTimestamp, () => {
        console.log("flight information send to redux store")
      });
      this.setState({
        waitingModal : true
      })
      let subscription;
      try{
        subscription = await this.subscribeEvent(this.props.contract, this.state.event)
      } catch(err) {
        console.log(err);
      }
      console.log("I am the from Account", this.props.metamaskAccount);
      try { 
        const result = await this.props.contract.fetchFlightStatus(airline, flight, updatedTimestamp, {from: this.props.metamaskAccount}); 
        console.log("Flight is getting checked...", result);
        if (result) {
          this.setState({
            subscription: subscription,
            event : {
              active : true
            }
          })
        }
      } catch(err) {
        console.log(err.message);
      };

      callback();
  }

  render() {
    let withdrawModalshowlClose = () => this.setState({ withdrawModalshow: false });
    let noCompensationModalClose = () => this.setState({ noCompensationModal: false });
    const { validated } = this.state;
    return (
      <Container>
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => this.handleSubmit(e)}
          className="transparent-box"
          id="submit-form"
          onChange={(event) => this.handleFormChange(event)}
        >
          <Form.Row>
            <Form.Group as={Col} md="6" controlId="flight">
              <Form.Label>Flight Number</Form.Label>
              <Form.Control type="text" placeholder="ZW2312" value={this.state.form.flight} required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid flight number.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="airline">
              <Form.Label>Airline Address</Form.Label>
              <Form.Control type="text" placeholder="0x18911376efeff48444d1323178bc9f5319686b75" value={this.state.form.airline} required />
              <Form.Control.Feedback type="invalid">
                Please provide a airline address.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="6" controlId="timestamp">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" placeholder="201905041454" value={this.state.form.timestamp} required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid timestamp.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Group>
            <Form.Check
              required
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
            />
          </Form.Group>
          <Button type="submit">Check Flight</Button>
        </Form>
        <LoadingFlightCheckModal
            show={this.state.waitingModal}
          />
        <WithdrawModal
            show={this.state.withdrawModalshow}
            onHide={withdrawModalshowlClose}
          />
        <NoCompensationModal
            show={this.state.noCompensationModal}
            onHide={noCompensationModalClose}
          />
      </Container>
    )
  }
}

// receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { 
      web3 : state.contract.web3,    
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract,
      ethers: state.contract.ethers
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps, actions),

)(CheckFlight);

