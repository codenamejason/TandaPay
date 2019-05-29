import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

/**
 * @summary Prevents an user from accessing a page when they're either 1.) not logged in or
 * 2.) Do not have the appropriate role to see the page
 * @param {Base Page} WrappedComponent
 */
let withAuthorization = WrappedComponent => {
  class AuthorizedComponent extends Component {
    render() {
      const { user } = this.props;
      let userHasPemissions = user;
      if (userHasPemissions) {
        return <WrappedComponent {...this.props} />;
      } else {
        return <Redirect to="/" />;
      }
    }
  }
  const mapStateToProps = state => {
    return {
      user: state.user
    };
  };
  return connect(mapStateToProps)(AuthorizedComponent);
};

/**
 * @summary Prevents the user from navigation or accessing base pages while authenticated.
 * Redirects the user to the base dashboard page
 * @param {Base Page} WrappedComponent
 */
let withoutAuthorization = WrappedComponent => {
  class UnauthorizedComponent extends Component {
    render() {
      const { user } = this.props;
      let userHasPemissions = user;
      if (!userHasPemissions) {
        // if the user doesn't exist
        return <WrappedComponent {...this.props} />;
      } else {
        return <Redirect to="/admin" />;
      }
    }
  }
  const mapStateToProps = state => {
    return {
      user: state.user
    };
  };
  return connect(mapStateToProps)(UnauthorizedComponent);
};

export { withAuthorization, withoutAuthorization };
