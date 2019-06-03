import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Form, Col, InputGroup} from 'react-bootstrap';

import { connect } from 'react-redux';

class FlightRegistration extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
        flight: "",
        airline: "",
        timestamp: "",
        amount: ""
       }
    };
  }

  handleFormChange = (event) => {
    const form = event.currentTarget;
    this.setState({   
      form: {
        flight: form.flight.value,
        airline: form.airline.value,
        timestamp: form.timestamp.value,
        amount: form.amount.value
      }
    });
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
      form: {
        flight: "",
        airline: "",
        timestamp: "",
        amount: ""
       }
    });
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.registerFlight(event, this.clearForm)
    }
    this.setState({ validated: true });
  }
  
  async registerFlight(event, callback) {
    event.preventDefault();
    console.log(this.state.form.flight);
      const flight = this.state.form.flight.toString();
      const airline = this.state.form.airline.toString();
      console.log(this.state.form.timestamp);
      debugger;
      const updatedTimestamp = Number(this.state.form.timestamp.split("-").join(""));
      const amount = Number(this.state.form.amount);
      let result;
      console.log(this.props.contract);
      try { 
        console.log(this);
        result = await this.props.contract.registerFlight(flight, airline, updatedTimestamp, amount, {from: this.props.metamaskAccount, value: amount}); 
        console.log("Flight Registered", result);
      } catch(err) {
        console.log(err.message);
      };
      callback();
  }

  render() {
    const { validated } = this.state;
    return (
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
            <Form.Label>Address of Airline</Form.Label>
            <Form.Control type="text" placeholder="0x18911376efeff48444d1323178bc9f5319686b75" value={this.state.form.airline} required />
            <Form.Control.Feedback type="invalid">
              Please provide a airline address.
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="timestamp">
            <Form.Label>Flight Number</Form.Label>
            <Form.Control type="date" placeholder="201905041454" value={this.state.form.timestamp} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid timestamp.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="amount">
            <Form.Label>Ether to ensure</Form.Label>
            <Form.Control type="number" placeholder="MAX 1 Ether" value={this.state.form.amount} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid ether amount.
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
        <Button type="submit">Submit form</Button>
      </Form>
    )
  }
}

// receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { 
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps),

)(FlightRegistration);

