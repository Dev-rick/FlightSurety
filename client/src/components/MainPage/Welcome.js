// Integrate here all components which are only visible at "/"

import React from 'react';
import "../../css/flightList.css";
import FlightRegistration from './FlightRegistration';
import CheckFlight from './CheckFlight'
import { Container, Row, Col } from 'react-bootstrap';

export default () => {
  return(
    <div>
      <Row className="justify-content-md-center">
        <h3>
            Welcome to the FlightSurety App!
        </h3>
      </Row>
      <Row className="justify-content-md-center">
          <FlightRegistration />
      </Row>
      <Row className="justify-content-md-center">
          <CheckFlight />
      </Row>
    </div>
  )
}
