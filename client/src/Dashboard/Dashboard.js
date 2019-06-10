import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import styles from "../Navigation/sidebar.style";
import Navigation from "../Navigation/Navigation";
import Main from "./pages/Main";

const Dashboard = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navigation />
      <Switch>
        <Route exact path="/admin/" component={Main} />
      </Switch>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Dashboard);
