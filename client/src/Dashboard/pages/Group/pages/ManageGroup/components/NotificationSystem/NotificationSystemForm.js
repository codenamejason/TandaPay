import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "../../../../../../../Policyholder/pages/Payments/pages/PaymentNew/payment.style";
import { getActivePeriod } from "../../../../../../../web3";
import * as actions from "../../../../../../../actions/group";
import EthAlert from "../../../../../../../components/EthAlert";
import Alert from "../../../../../../../components/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

class NotificationSystemForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      working: false,
      groupName: "N/A",
      submitting: false,
      members: "0",
      subgroups: "0",
      period: 0
    };
  }
  async componentDidMount() {
    try {
      const { groupName, members, subgroups } = this.props.group;
      const [period, error] = await getActivePeriod(
        this.props.ethereum.web3,
        this.props.group.contract
      );

      if (!error) {
        this.setState({
          groupName,
          members: members.length,
          subgroups: subgroups.length,
          period
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleClaimtNotfication = async event => {
    event.preventDefault();
    this.setState({
      claimWorking: true
    });

    let res = await this.props.notify(
      this.state.period,
      "claim",
      this.state.groupName
    );

    if (res == true) {
      this.setState({
        claimWorking: false
      });
      let type = "success";
      let msg = "Notification sent successfully";

      this.props.dispatchCustomMessage(msg, type);
    } else {
      this.setState({
        claimWorking: false
      });
      let type = "danger";
      let msg = "Notification not sent, try again later";

      this.props.dispatchCustomMessage(msg, type);
    }
  };

  handlePaymentNotfication = async event => {
    event.preventDefault();
    this.setState({
      working: true
    });

    let res = await this.props.notify(
      this.state.period,
      "payment",
      this.state.groupName
    );

    if (res == true) {
      this.setState({
        working: false
      });
      let type = "success";
      let msg = "Notification sent successfully";

      this.props.dispatchCustomMessage(msg, type);
    } else {
      this.setState({
        working: false
      });
      let type = "danger";
      let msg = "Notification not sent, try again later";

      this.props.dispatchCustomMessage(msg, type);
    }
  };

  render() {
    const { classes } = this.props;
    const { groupName, working, members, subgroups, period } = this.state;

    return (
      <React.Fragment>
        <div className={classes.root2}>
          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography gutterBottom variant="h4">
                  {groupName} group
                </Typography>
              </Grid>
            </Grid>
            <Typography color="textSecondary" variant="body2">
              Notification System{" "}
            </Typography>
          </div>
          <Divider variant="middle" />

          <div className={classes.section3}>
            <form onSubmit={this.handlePaymentNotfication.bind(this)}>
              <Typography variant="subtitle1">
                Send users notification to finalize their payments
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={this.state.working == true || !this.state.period > 0}
              >
                {this.state.working && (
                  <span>
                    {" "}
                    <CircularProgress size={24} /> Notifying...
                  </span>
                )}
                {!this.state.working && <small> Payment Reminder</small>}
              </Button>
              <br></br>
            </form>
          </div>

          <Divider />
          <div className={classes.section3}>
            <form onSubmit={this.handleClaimtNotfication.bind(this)}>
              <Typography variant="subtitle1">
                Send users notification about white listed claims
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={
                  this.state.claimWorking == true || !this.state.period > 0
                }
              >
                {this.state.claimWorking && (
                  <span>
                    {" "}
                    <CircularProgress size={24} /> Notifying...
                  </span>
                )}
                {!this.state.claimWorking && <small> Claim Reminder</small>}
              </Button>
              <br></br>
            </form>
          </div>
        </div>
        <Alert />
        <EthAlert />
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
)(withStyles(styles, { withTheme: true })(NotificationSystemForm));
