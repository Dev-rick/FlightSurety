import { compose } from 'redux';
import React, {Component} from 'react';
import {Container, Button, Form, Col} from 'react-bootstrap';
import LoadingModal from './LoadingModal';
import { connect } from 'react-redux';

class AdminRegistration extends Component {
  constructor(...args) {
    super(...args);
    this.state = { 
      validated: false,
      form: {
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
        amount: form.amount.value
      }
    });
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
      form: {
        flight: "",
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
      this.registerAdmin(event, this.clearForm)
    }
    this.setState({ validated: true });
  }
  
  async registerAdmin(event, callback) {
    event.preventDefault();
    this.setState({
      loadingModal: {
        show : true,
        title : "Registrating as Admin",
        body : "Please do not leave page while loading..."
     }
    })
    console.log(this.state.form.flight);
      const ether = this.props.web3.utils.toWei(this.state.form.amount, "ether");
      let result;
      try { 
        result = await this.props.contract.registerAdmin({from: this.props.metamaskAccount, value: ether}); 
        console.log("Registered as Admin", result);
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
            <Form.Group as={Col} md="6" controlId="amount">
              <Form.Label>Please provide 10 ethers! <small>(*in testing: more than 1 wei*)</small></Form.Label>
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
          <Button type="submit">For Airlines: Register as Admin</Button>
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
)(AdminRegistration);

