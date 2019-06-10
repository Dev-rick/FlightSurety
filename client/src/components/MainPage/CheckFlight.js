import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Form, Col, InputGroup} from 'react-bootstrap';

import { connect } from 'react-redux';


class CheckFlight extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
        flight: "",
        airline: "",
        timestamp: ""
       }
    };
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


  async checkFlight(event, callback) {
    event.preventDefault();
    console.log(this.state.form.flight);
      const flight = this.state.form.flight.toString();
      const airline = this.state.form.airline.toString();
      const updatedTimestamp = Number(this.state.form.timestamp.split("-").join(""));
      let result;
      console.log(this.props.contract);
      try { 
        console.log(this);
       
        result = await this.props.contract.fetchFlightStatus(airline, flight, updatedTimestamp, {from: this.props.metamaskAccount}); 
        console.log("Flight Checked", result);
        if (result) {
            console.log(true);
            // lets appear form appear
        }
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

)(CheckFlight);

