import React from "react";
import clsx from "clsx";
import { withStyles, Card, Typography, Button } from "@material-ui/core";
import styles from "./card.style";
import WalletModal from "../WalletModal/WalletModal";
import BuyDai from "../BuyDai/BuyDai";
import { connect } from "react-redux";
import { getDAIBalance } from "../../../../../web3";
import WyreModal from "../../../../components/WyreModal/WyreModal";
/**
 * @summary
 * @param {Object} props
 */
class WalletCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      type: "",
      balance: 0
    };
  }

  async componentDidMount() {
    try {
      const [balance, error] = await getDAIBalance(
        this.props.ethereum.web3,
        this.props.ethereum.DAI
      );
      if (!error) {
        this.setState({
          balance
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * @summary Function generator that takes in the type of modal that it will open.
   * It uses the arrow functions to automatically bind the returned functions.
   * This is necessary since the functions returned will change the state of the component.
   * @param {String} type
   * @returns {Function} - returns a basic JS function to update the state when called
   */
  handleOpen = type => {
    switch (type) {
      case "sell": {
        return () => {
          this.setState({
            open: true,
            type: "sell"
          });
        };
      }
      case "send": {
        return () => {
          this.setState({
            open: true,
            type: "send"
          });
        };
      }
      case "buy": {
        return () => {
          this.setState({
            open: true,
            type: "buy"
          });
        };
      }
      default: {
        return;
      }
    }
  };

  /**
   * @summary It will unilatirally close any modal currently opened and remove the currently selected tyep
   */
  handleClose = () => {
    this.setState({
      open: false,
      type: ""
    });
  };
  render() {
    const { classes, user } = this.props;
    const { open, type, balance } = this.state;
    return (
      <Card className={classes.walletCard}>
        <Typography variant="h6">DAI Stablecoin</Typography>
        <div className={classes.balance}>
          <Typography variant="body1">Balance</Typography>
          <Typography variant="body1">{balance} DAI</Typography>
        </div>
        {/* <WyreModal /> */}
        <WalletModal
          open={open}
          type={type}
          handleClose={this.handleClose}
          address={user.ethereumAddress}
        />
        <div className={classes.buttonGroup}>
          <BuyDai />
        </div>
      </Card>
    );
  }
}

function mapStateToProps({ ethereum, user }) {
  return { ethereum, user };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(WalletCard)
);
