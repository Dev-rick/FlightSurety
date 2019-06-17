import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Modal, Form, Container} from 'react-bootstrap';
import { connect } from 'react-redux';
import LoadingModal from './LoadingModal';


class WithdrawModal extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        validated: false,
        loadingModal: {
          show : false,
          title : "",
          body : ""
      }
    };
  }

  clearForm = () => {
    this.setState({ 
      validated: false, 
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
      this.withdrawMoney(event, this.clearForm)
    }
    this.setState({ validated: true });
  }
  
  async withdrawMoney(event, callback) {
    event.preventDefault();
    this.setState({
      loadingModal: {
        show : true,
        title : "Getting Your Compensation",
        body : "Please do not leave page while loading..."
     }
    })
      let result;
      try { 
        result = await this.props.contract.withdrawMoney(this.props.flight, this.props.timestamp, {from: this.props.metamaskAccount}); 
        console.log("Money successfully withdrawn", result);
      } catch(err) {
        console.log(err.message);
      };
      callback();
  }

    render() {
      const { validated } = this.state;
      return (
        <div>
          <Modal
            show={this.props.show}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Compensation for flight delay
              </Modal.Title>
            </Modal.Header>
          <Form
              noValidate
              validated={validated}
              onSubmit={(e) => this.handleSubmit(e)}
              className="transparent-box"
              id="submit-form"
            >
            <Modal.Body>
                  <Form.Group>
                    <Form.Check
                      required
                      label="Agree to terms and conditions"
                      feedback="You must agree before submitting."
                    />
                  </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={this.props.onHide}>Get compensation</Button>
            </Modal.Footer>
          </Form>
          </Modal>
          <LoadingModal
              show={this.state.loadingModal.show}
              title={this.state.loadingModal.title}
              body={this.state.loadingModal.body}
            />
        </div>
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

