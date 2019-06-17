import { compose } from 'redux';
import React, {Component} from 'react';
import {Container, Button, Form, Col, InputGroup} from 'react-bootstrap';

import LoadingModal from './LoadingModal';
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
       },
       loadingModal: {
        show : false,
        title : "",
        body : ""
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
       },
       loadingModal: {
        show: false
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
    this.setState({
      loadingModal: {
        show : true,
        title : "Registrating Flight",
        body : "Please do not leave page while loading..."
     }
    })
    console.log(this.state.form.flight);
      const flight = this.state.form.flight.toString();
      const airline = this.state.form.airline.toString();
      console.log(this.state.form.timestamp);
      
      const updatedTimestamp = Number(this.state.form.timestamp.split("-").join(""));
      // const amount = Number(this.state.form.amount) * 1000000000000000000;
      const ether = this.props.web3.utils.toWei(this.state.form.amount, "ether");
      let result;
      try { 
        result = await this.props.contract.registerFlight(
          flight, 
          airline, 
          updatedTimestamp,
          {from: this.props.metamaskAccount, value: ether}
          ); 
        console.log("Flight Registered", result);
      } catch(err) {
        console.log(err.message);
      };
      callback();
  }

  render() {
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
            <Form.Label>Select your flight</Form.Label>
            <Form.Control  value={this.state.form.flight} as="select" required >
              <option>BA2490</option>
              <option>BA2499</option>
              <option>BA2426</option>
              <option>BA2490A</option>
              <option>BA2490B</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select a flight!
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
        <Button type="submit">For Passengers: Register your Flight</Button>
      </Form>
      <LoadingModal
            show={this.state.loadingModal.show}
            title={this.state.loadingModal.title}
            body={this.state.loadingModal.body}
          />
      </Container>
    )
  }
}

// receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { 
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract,
      web3: state.contract.web3
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps),

)(FlightRegistration);

