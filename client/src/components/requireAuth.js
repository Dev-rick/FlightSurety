import React, { Component } from 'react';
import { connect } from 'react-redux';

// the argument ChildComponent is in this example CommentBox
//connect is also HOC it wraps the component and export a ComposedComponent with
// the functionality with connect


export default (ChildComponent) => {
  //this is the class we inject in the other component
  class ComposedComponent extends Component {
    //call this function when our component just got rendered
    componentDidMount() {
      this.shouldNavigateAway()
    }

    //call this function when out component just got new props
    // when a user is looking at the Post Comment section and logs out
    // this function will be called as the props.auth got updated via the Action
    //located in the App Component
    componentDidUpdate() {
      this.shouldNavigateAway()
    }

    shouldNavigateAway() {
      if (!this.props.auth) {
        // force the user to leave
        this.props.history.push('/');
      }
    }
    //here we have to add the props in order to pass them to the CommentBox
    // with {...this.props} which takes all the props from the parent pass it to
    // the child
    render() {
      return < ChildComponent {...this.props}/>
    }
  }

  //the auth property that we want comes from state.auth (redux)
  //the auth property is then used in React by writing props.auth
  function mapStateToProps(state) {
    return { auth: state.auth.authenticated }
  };


  return connect(mapStateToProps)(ComposedComponent)

};
