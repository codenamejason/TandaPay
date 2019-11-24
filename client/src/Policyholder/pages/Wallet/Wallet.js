import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";
import styles from "./wallet.style";
import WalletOverview from "./pages/WalletOverview";
import TransferReview from "./pages/TransferReview";
import SellDai from "./pages/SellDai";
class Wallet extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/holder/wallet/sell/:email" component={SellDai} />
          <Route exact path="/holder/wallet" component={WalletOverview} />
          <Route exact path="/holder/wallet/:id" component={TransferReview} />
        </Switch>
      </main>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Wallet);
