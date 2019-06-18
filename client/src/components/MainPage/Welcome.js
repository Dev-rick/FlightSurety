// Integrate here all components which are only visible at "/"

import React from 'react';
import "../../css/flightList.css";
import FlightRegistration from './FlightRegistration';
import CheckFlight from './CheckFlight'
import { Container, Row, Button, Alert} from 'react-bootstrap';
import AirlineRegistration from './AirlineRegistration';
import AdminRegistration from './AdminRegistration';

export default () => {
  return(
    <Container>
      <hr></hr>
      <span> </span>
      <Row className="justify-content-md-center">
          <Alert variant="info">
            <Alert.Heading>Hey, nice to see you!</Alert.Heading>
            <p>
                I am a project from Udacity build by Rick W.  
            </p>
            <hr />
            <p className="mb-0">
                If you are interested in the code of the website, you can visit me on
                <Alert.Link href="https://github.com/Userrick/FlightSurety"> Github</Alert.Link>.
            </p>
        </Alert>
      </Row>
      <Row className="justify-content-md-center">
          <AirlineRegistration />
      </Row>
      <Row className="justify-content-md-center">
          <AdminRegistration />
      </Row>
      <Row className="justify-content-md-center">
          <FlightRegistration />
      </Row>
      <Row className="justify-content-md-center">
          <CheckFlight />
      </Row>
      <Row className="justify-content-md-center">
          <hr></hr>
          <span> </span>
      </Row>
    </Container>
  )
}
