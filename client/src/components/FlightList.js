import React, {Component} from 'react';
import {DropdownButton, Dropdown, Container, Row, Col} from 'react-bootstrap';

class FlightList extends Component {
  render() {
    return (
        <Col md="auto">
          <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
        </Col>
    )
  }
}


export default FlightList;
