import React from "react";
import {
  CssBaseline,
  Avatar,
  Paper,
  Grid,
  Typography,
  withStyles,
  Tabs,
  Tab
} from "@material-ui/core";
import { LockOutlined, LockOpenOutlined } from "@material-ui/icons";
import SignUp from "./Form/SignUp";
import Login from "./Form/Login";
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
  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {this.renderFormArea()}
        </Grid>
      </Grid>
    );
  }
  renderFormArea = () => {
    const { classes } = this.props;
    return (
      <div className={classes.paper}>
        <Tabs value={this.state.tab} onChange={this.onTabChange}>
          <Tab label="Sign Up" />
          <Tab label="Log In" />
        </Tabs>
        {this.state.tab === 0 && this.renderSignUpForm()}
        {this.state.tab === 1 && this.renderLoginForm()}
      </div>
    );
  };

  renderSignUpForm = () => {
    const { classes } = this.props;
    return (
      <div className={classes.paper}>
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
      <div className={classes.paper}>
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

export default withStyles(styles, { withTheme: true })(Registration);
