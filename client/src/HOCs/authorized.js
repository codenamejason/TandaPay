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

      let userHasPemissions = user && user.accountCompleted;

      if (userHasPemissions && user.role == "secretary") {
        return (
          <React.Fragment>
            <Redirect to="/admin/payments" />
            <WrappedComponent {...this.props} />
          </React.Fragment>
        );
      } else if (userHasPemissions && user.role == "policyholder") {
        return (
          <React.Fragment>
            <Redirect to="/holder/payments" />
            <WrappedComponent {...this.props} />
          </React.Fragment>
        );
      } else {
        if (!user) {
          return <Redirect to="/" />;
        } else {
          return <Redirect to="/setup" />;
        }
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
        const { accountCompleted } = user;

        if (accountCompleted) {
          if (user.role == "policyholder") {
            return <Redirect to="/holder/payment" />;
          } else if (user.role == "secretary") {
            return <Redirect to="/admin/payment" />;
          }
          //return <Redirect to="/admin" />;
        } else {
          return <Redirect to="/setup" />;
        }
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

/**
 *
 * @param {*} WrappedComponent
 */
let withIncompleteAuthorization = WrappedComponent => {
  class LimitedComponent extends Component {
    render() {
      const { user } = this.props;

      if (!user) {
        return <Redirect to="/" />;
      } else if (user && user.accountCompleted) {
        if (user.role == "policyholder") {
          return <Redirect to="/holder" />;
        } else if (user.role == "secretary") {
          return <Redirect to="/admin" />;
        }
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  const mapStateToProps = state => {
    return { user: state.user };
  };

  return connect(mapStateToProps)(LimitedComponent);
};

export { withAuthorization, withoutAuthorization, withIncompleteAuthorization };
