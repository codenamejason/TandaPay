import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";
import styles from "./help.style.js";
import SecretaryHelpGuide from "./Pages/SecretaryHelpGuide/SecretaryHelpGuide";
import Index from "./Pages/Index/Index";

class Help extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/admin/help" component={Index} />
        </Switch>
        <Switch>
          <Route
            exact
            path="/admin/help/secretary-guide"
            component={SecretaryHelpGuide}
          />
        </Switch>
      </main>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Help);
