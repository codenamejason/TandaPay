import React from "react";
import {
  CssBaseline,
  Avatar,
  Paper,
  Grid,
  Typography,
  withStyles,
  Tabs,
  Tab,
  Link,
  Divider
} from "@material-ui/core";
import { LockOutlined, LockOpenOutlined } from "@material-ui/icons";
import {
  GoogleLoginButton,
  FacebookLoginButton
} from "react-social-login-buttons";
import { connect } from "react-redux";
import * as actions from "../actions";
import { SignUp, Login } from "./Form/";
import styles from "./registration.style";

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  onTabChange = (event, newValue) => {
    this.setState({
      tab: newValue
    });
  };
  handleGoogleLogin = event => {
    this.props.googleSignin();
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image}>
          {this.renderHeroText()}
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {this.renderFormArea()}
        </Grid>
      </Grid>
    );
  }
  renderHeroText = () => {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h1" className={classes.title}>
          TandaPay
        </Typography>
        <Typography variant="h4" className={classes.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel.
        </Typography>
      </div>
    );
  };
  renderFormArea = () => {
    const { classes } = this.props;
    return (
      <div className={classes.area}>
        <Tabs value={this.state.tab} onChange={this.onTabChange}>
          <Tab label="Sign Up" />
          <Tab label="Log In" />
        </Tabs>
        {this.state.tab === 0 && this.renderSignUpForm()}
        {this.state.tab === 1 && this.renderLoginForm()}
        <Divider className={classes.divider} />

        <Grid container className={classes.social}>
          <GoogleLoginButton>
            <Link
              href={"/auth/google"}
              color="inherit"
              className={classes.link}
            >
              Sign In With Google
            </Link>
          </GoogleLoginButton>

          <FacebookLoginButton>
            <Link
              href={"/auth/facebook"}
              color="inherit"
              className={classes.link}
            >
              Sign In With Facebook
            </Link>
          </FacebookLoginButton>
        </Grid>
      </div>
    );
  };

  renderSignUpForm = () => {
    const { classes } = this.props;
    return (
      <div className={classes.form}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <SignUp />
      </div>
    );
  };
  renderLoginForm = () => {
    const { classes } = this.props;
    return (
      <div className={classes.form}>
        <Avatar className={classes.avatar}>
          <LockOpenOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Login />
      </div>
    );
  };
}

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(Registration));
