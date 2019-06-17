import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Modal, Form, Col, InputGroup} from 'react-bootstrap';
import { connect } from 'react-redux';


class WithdrawModal extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        validated: true,
      };
    }
    handleSubmit = async (event) => {
      event.preventDefault();
      let result;
      try{
        result = await this.props.contract.withdrawMoney(this.props.flight, this.props.timestamp, {from: this.props.metamaskAccount}); 
        console.log(result);
      }catch(err) {
        console.log(err);
      }
      console.log("submit was handled");
    }


    render() {
      const { validated } = this.state;
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Compensation for flight delay
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>We are very sorry for the delay please apply take this compensation:</h4>
            <p>
              Information about your withdraw from props
            </p>
          <Form
              noValidate
              validated={validated}
              onSubmit={(e) => this.handleSubmit(e)}
              className="transparent-box"
              id="submit-form"
            >
              <Form.Group>
                <Form.Check
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                />
              </Form.Group>
              <Button type="submit">Get compensation</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }

  // receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { 
      web3 : state.contract.web3,    
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract,
      flight: state.flightInformation.flight,
      timestamp: state.flightInformation.timestamp
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps),

)(WithdrawModal);

