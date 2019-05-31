import React from "react";
import { Link } from "react-router-dom";
import { isEmail, isEmpty, isLength } from "validator";
//redux
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Button, Grid, TextField, withStyles } from "@material-ui/core";
import styles from "./styles/form.style";
import { EmailField, PasswordField } from "./components/Fields/";

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      emailError: "",
      passwordError: ""
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;

    this.props.signUp({ name, email, password });
  };

  render() {
    const { classes } = this.props;
    const { email, emailError, password, passwordError } = this.state;
    return (
      <form className={classes.form} noValidate>
        {this.renderNameField()}
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
          variant="contained"
          color="primary"
          className={classes.submit}
          component={RegLink}
          to="/admin"
          onClick={this.handleSubmit}
        >
          SIGN UP
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
  handleNameChange = event => {
    //add validation to check for error
    let name = event.target.value;
    this.setState({
      name: name
    });
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
  renderNameField = () => {
    return (
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        onChange={this.handleNameChange}
        value={this.state.name}
      />
    );
  };

  renderExtra = () => {
    return (
      <Grid container>
        <Grid item xs>
          <Link to="/admin" variant="body2">
            Forgot password?
          </Link>
        </Grid>
      </Grid>
    );
  };
}

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(SignUp));
