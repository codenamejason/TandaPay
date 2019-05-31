import React from "react";
import { Link } from "react-router-dom";
import { isEmail, isEmpty, isLength } from "validator";
//redux
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Button, Grid, withStyles } from "@material-ui/core";
import { EmailField, PasswordField } from "./components/Fields/";

import styles from "./styles/form.style";
const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: ""
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.logIn({ email, password });
    //make request to sign in
  };

  render() {
    const { classes } = this.props;
    const { email, emailError, password, passwordError } = this.state;
    return (
      <form className={classes.form} noValidate>
        <EmailField
          handleEmailChange={this.handleEmailChange}
          emailError={emailError}
          email={email}
        />
        <PasswordField
          handlePasswordChange={this.handlePasswordChange}
          passwordError={passwordError}
          password={password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          component={RegLink}
          to="/admin"
          onClick={this.handleSubmit}
        >
          Login
        </Button>
        {this.renderExtra()}
      </form>
    );
  }

  handleEmailChange = event => {
    //add validation to check for error
    let email = event.target.value;
    this.setState({
      email: email
    });

    if (!isEmail(email) && !isEmpty(email)) {
      this.setState({
        emailError: "Invalid Email"
      });
    } else {
      this.setState({
        emailError: ""
      });
    }
  };

  handlePasswordChange = event => {
    let password = event.target.value;
    this.setState({
      password: password
    });

    let invalidPassword =
      !isLength(password, {
        min: 8
      }) && !isEmpty(password);
    if (invalidPassword) {
      this.setState({
        passwordError: "Invalid Password"
      });
    } else {
      this.setState({
        passwordError: ""
      });
    }
  };

  renderExtra = () => {
    return (
      <Grid container>
        <Grid item xs>
          <Link to="/admin" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link to="/admin" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    );
  };
}

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(Login));
