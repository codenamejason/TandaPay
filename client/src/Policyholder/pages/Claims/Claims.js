import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";
import styles from "./claims.style";
import ClaimsOverview from "./pages/ClaimsOverview";
import ClaimReview from "./pages/ClaimReview/ClaimReview";
import ClaimNew from "./pages/ClaimNew/ClaimNew";
import DefectClaim from "./pages/DefectClaim/DefectClaim";
import DefectionGuide from "./pages/DefectionGuide/DefectionGuide";
import ClaimsGuide from "./pages/ClaimsGuide/ClaimsGuide";

class Claims extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/holder/claims" component={ClaimsOverview} />
          <Route exact path="/holder/claims/new" component={ClaimNew} />
          <Route exact path="/holder/claims/defect" component={DefectClaim} />
          <Route
            exact
            path="/holder/claims/defect/guide"
            component={DefectionGuide}
          />

          <Route exact path="/holder/claims/guide" component={ClaimsGuide} />

          <Route exact path="/holder/claims/:id" component={ClaimReview} />
        </Switch>
      </main>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Claims);
