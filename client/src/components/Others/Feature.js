// component were the user must be signed in to see setInterval(function () {
 import React, { Component } from 'react';
 import requireAuth from './requireAuth';

 class Feature extends Component{
   render() {
     return(
       <h2>You are authenticated and can see this secret page</h2>
     )
   }
 }

export default requireAuth(Feature);
