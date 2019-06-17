import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import { MetroSpinner } from "react-spinners-kit";

class LoadingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
    };
  }
    render() {
      return (
        <Modal
          show={this.props.show}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
            {this.props.body}
            </p>
            <MetroSpinner
              size={30}
              color="#686769"
              loading={this.state.loading}
          />
          </Modal.Body>
        </Modal>
      );
    }
  }

  // receives the state from the store by calling this in the connect HOC

export default LoadingModal;

