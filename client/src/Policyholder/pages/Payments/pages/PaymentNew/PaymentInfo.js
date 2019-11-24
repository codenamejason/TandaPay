import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "./payment.style";
import EthAlert from "../../../../../components/EthAlert";
import Alert from "../../../../../components/Alert";
import * as actions from "../../../../../actions/group";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  getDAIBalance,
  calculatePayment,
  getActivePeriod,
  approvePremiumForSmartContractAddress,
  payYourPremium
} from "../../../../../web3";
class PaymentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      working: false,
      paying: false,
      approving: false,
      balance: 0,
      premium: "N/A",
      period: "N/A"
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

      const [premiumPayment, err] = await calculatePayment(
        this.props.ethereum.web3,
        this.props.group.contract
      );

      if (!err) {
        this.setState({
          premium: premiumPayment
        });
      }

      const [period, pError] = await getActivePeriod(
        this.props.ethereum.web3,
        this.props.group.contract
      );

      if (!pError) {
        this.setState({
          period
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      paying: true
    });

    const [result, error] = await payYourPremium(
      this.props.ethereum.web3,
      this.props.group.contract,
      this.state.period
    );
    if (result) {
      await this.props.recordpremiumpayment(
        this.props.user.groupID,
        this.props.user._id,
        this.state.period,
        this.props.user.name,
        result.transactionHash,
        this.state.premium
      );

      let msg = "Premium paid successfully";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        paying: false
      });
    } else {
      this.setState({
        paying: false
      });
      let msg = "Failed. try again later.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
    }
  };

  approvePremium = async () => {
    this.setState({
      approving: true
    });
    const [result, error] = await approvePremiumForSmartContractAddress(
      this.props.ethereum.web3,
      this.props.ethereum.DAI,

      this.state.premium,
      this.props.group.contract
    );
    if (result) {
      let msg =
        "Task completed successfully. Wait for the trasaction comfirm below paying your premium";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        approving: false
      });
    } else {
      let msg = "Failed. try again later.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        approving: false
      });
    }
  };
  render() {
    const { classes } = this.props;
    const { balance, premium, working, period } = this.state;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography gutterBottom variant="h4">
                  Balance
                </Typography>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h6">
                  ${balance} DAI
                </Typography>
              </Grid>
            </Grid>
            <Typography color="textSecondary" variant="body2">
              Total balance of DAI in your wallet
            </Typography>
          </div>
          <Divider variant="middle" />
          <div className={classes.section2}>
            <Typography gutterBottom variant="body1">
              Period
            </Typography>
            <div>
              <Chip className={classes.chip} label={period} />
            </div>
          </div>

          <div className={classes.section2}>
            <Typography gutterBottom variant="body1">
              Premium
            </Typography>
            <div>
              <Chip className={classes.chip} label={premium + " DAI"} />
            </div>
          </div>

          <div className={classes.section3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleSubmit.bind(this)}
              disabled={this.state.paying == true || this.state.period == 0}
            >
              {this.state.paying && (
                <span>
                  {" "}
                  <CircularProgress size={24} /> Paying...
                </span>
              )}
              {!this.state.paying && <small> Pay Premium</small>}
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={this.approvePremium}
              disabled={this.state.approving == true || this.state.period == 0}
            >
              {this.state.approving && (
                <span>
                  {" "}
                  <CircularProgress size={24} /> Approving...
                </span>
              )}
              {!this.state.approving && <small> Approve Premium</small>}
            </Button>
          </div>
        </div>
        <EthAlert />
        <Alert />
      </React.Fragment>
    );
  }
}

function mapStateToProps({ ethereum, group, user }) {
  return { ethereum, group, user };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(PaymentInfo));
