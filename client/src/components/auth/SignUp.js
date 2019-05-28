import React, { Component } from 'react';
// compose helps us to write up HOC with  much better syntax
import { compose } from 'redux';
import {reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions'


class SignUp extends Component {

  //instance property that receives an arrow function by making this an arrow function
  //so we don't have to worry about binding the content of onSubmit
  // it's saves us to call the combined and worry about that
  onSubmit = (formProps) => {
    // calls the action creator wired up from Redux through connect
    // as a second argument, it will be callback to function which gets called when
    // the user successfully signed up
    this.props.signup(formProps, () => {
      this.props.history.push('/feature')
    });
    console.log(formProps);
  }


  render(){
    // before we can submit and extract the email and password from the form
    // we have to extract the handleSubmit from the this.props as it is provided
    // from the HOC of Field and we access it through this.props
    const { handleSubmit } = this.props;
    // we don't put () on onSubmit in order to avoid calling it everytime the component
    // renders
    return(
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <fieldset>
          <label>
            Email:
            <Field
              name='email'
              type='text'
              component='input'
              autoComplete='none'
            />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Password:
            <Field
              name='password'
              type='password'
              autoComplete='none'
              component='input'
            />
          </label>
        </fieldset>
        <div>{this.props.errorMessage}</div>
        <button>Sign Up</button>
      </form>
    )
  }
}


// receives the state from the store by calling this in the connect HOC
function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage }
}

//form => sign tag

export default compose(
  //put in here all HOC you want to use:
  // null --> no state wired up here
  connect(mapStateToProps, actions),
  reduxForm({form: 'signup'})
)(SignUp);
