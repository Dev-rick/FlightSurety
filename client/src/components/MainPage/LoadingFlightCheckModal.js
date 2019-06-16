import { compose } from 'redux';
import React, {Component} from 'react';
import {Button, Modal, Form, Col, InputGroup} from 'react-bootstrap';
import { connect } from 'react-redux';
import { MetroSpinner } from "react-spinners-kit";

class LoadingFlightCheckModal extends Component {
    state = {
        loading: true,
    };

    render() {
      const { loading } = this.state;
      return (
        <Modal
          {...this.props}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Checking flight delay
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
            Please don't leave page while loading...
            </p>
            <MetroSpinner
              size={30}
              color="#686769"
              loading={loading}
          />
          </Modal.Body>
        </Modal>
      );
    }
  }

  // receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { 
      web3 : state.contract.web3,    
      metamaskAccount: state.contract.metamaskAccount,
      contract: state.contract.contract
  }
}

export default compose(
//put in here all HOC you want to use:
// null --> no state wired up here
connect(mapStateToProps),

)(LoadingFlightCheckModal);

