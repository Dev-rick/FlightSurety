import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';


class NoCompensationModal extends Component {

    render() {
      return (
        <Modal
          show={this.props.show}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              No compensation for flight delay
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>There is no compensation for your flight </h4>
            <p>
              If your flight was delayed it was due to some other reasons but not because of the airline
            </p>
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
      flight: state.flightInformation.flight
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps),

)(NoCompensationModal);

