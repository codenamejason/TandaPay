import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { attemptConnection } from "../web3";
import styles from "./dashboard.style";
import Navigation from "../Navigation/Navigation";
import { Payments, Profile, Group, Wallet, Claims, Help } from "./pages";
import * as actions from "../actions";
import Loader from "../components/Loader";
class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      loading: false
    };
    this.props.fetchGroup();
    this.props.fetchClaims();
    attemptConnection(user);
  }

  render() {
    const { classes } = this.props;

    if (this.state.loading) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <Navigation />
          <Loader />
        </div>
      );
    }
    return (
      <SnackbarProvider maxSnack={3}>
        <div className={classes.root}>
          <CssBaseline />
          <Navigation />
          <Switch>
            <Route path="/admin/payments" component={Payments} />
            <Route path="/admin/profile" component={Profile} />
            <Route path="/admin/groups" component={Group} />
            <Route path="/admin/wallet" component={Wallet} />
            <Route path="/admin/claims" component={Claims} />
            <Route exact path="/admin/help" component={Help} />
          </Switch>
        </div>
      </SnackbarProvider>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}
export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(Dashboard));
