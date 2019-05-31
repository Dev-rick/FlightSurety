// Integrate here all these components which are visible on all the pages 
// children are all those components wrapped in index.js file in <App> </App> 

import React from 'react';
import '../css/main.css';
// import Header from './Header';
import {Container} from 'react-bootstrap';

export default ({ children }) => {
  return (
    <Container>
      {/* <Header /> */}
      { children }
    </Container>
  );
};

