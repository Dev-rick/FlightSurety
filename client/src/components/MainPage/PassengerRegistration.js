import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Form, Col, InputGroup} from 'react-bootstrap';

import { connect } from 'react-redux';
import * as actions from '../../actions/passengerRegistration';

class PassengerRegistration extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
        flight: "",
        amount: "",
        checked: false,
      }
    };
  }

  handleCheckboxChange = (event) => {
    console.log(event.target.checked);
    this.setState({
      form: {
        checked: event.target.checked
      }
    })
  }

  handleFormChange = (event) => {
    const form = event.currentTarget;
    console.log(form);
    this.setState({   
      form: {
        flight: form.flight.value,
        amount: form.amount.value
      }
    });
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
      form: {
        flight: "",
        amount: "",
        checked: false
      }
    });
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.registerPassenger(event, this.clearForm)
    }
    this.setState({ validated: true });
  }
  
  async registerPassenger(event, callback) {
    event.preventDefault();
    console.log(this.state.form.flight);
      const flight = this.state.form.flight.toString();
      const amount = Number(this.state.form.amount);
      let result;
      console.log(this.props.contract);
      try { 
        console.log(this);
        result = await this.props.contract.registerPassenger(flight, amount, {from: this.props.metamaskAccount, value: amount}); 
        console.log("Passenger Registered", result);
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
      web3Provider: state.contract.web3Provider,
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps, actions),

)(PassengerRegistration);

