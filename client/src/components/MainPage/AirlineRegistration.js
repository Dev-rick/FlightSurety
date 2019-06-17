import { compose } from 'redux';
import React, {Component} from 'react';
import {Container, Button, Form, Col} from 'react-bootstrap';

import LoadingModal from './LoadingModal';
import { connect } from 'react-redux';

class AirlineRegistration extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
        airline: ""
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
        airline: form.airline.value,
      }
    });
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
      form: {
        airline: ""
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
      this.registerAirline(event, this.clearForm)
    }
    this.setState({ validated: true });
  }
  
  async registerAirline(event, callback) {
    event.preventDefault();
    this.setState({
      loadingModal: {
        show : true,
        title : "Registrating Airline",
        body : "Please do not leave page while loading..."
     }
    })
    console.log(this.state.form.flight);
      const airline = this.state.form.airline.toString();
      let result;
      console.log(this.props.contract);
      try { 
        console.log(this);
        result = await this.props.contract.registerAirline(airline, {from: this.props.metamaskAccount}); 
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
            <Form.Group as={Col} md="6" controlId="airline">
              <Form.Label>Address of Airline</Form.Label>
              <Form.Control type="text" placeholder="0x18911376efeff48444d1323178bc9f5319686b75" value={this.state.form.airline} required />
              <Form.Control.Feedback type="invalid">
                Please provide a airline address.
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
          <Button type="submit">For Admins: Register Airline</Button>
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
)(AirlineRegistration);

