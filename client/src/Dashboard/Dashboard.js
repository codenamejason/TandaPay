import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { attemptConnection } from "../web3";
import styles from "./dashboard.style";
import Navigation from "../Navigation/Navigation";
import { Payments, Profile, Group, Wallet, Claims, Help } from "./pages";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        const { user } = props;
        attemptConnection(user);
    }

    render() {
        const { classes } = this.props;
        return (
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
        );
    }
}

function mapStateToProps({ user }) {
    return { user };
}
export default connect(
    mapStateToProps,
    null
)(withStyles(styles, { withTheme: true })(Dashboard));
