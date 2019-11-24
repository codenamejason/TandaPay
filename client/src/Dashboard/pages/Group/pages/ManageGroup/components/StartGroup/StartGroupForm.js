import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "../../../../../../../Policyholder/pages/Payments/pages/PaymentNew/payment.style";
import { startYourGroup, getActivePeriod } from "../../../../../../../web3";
import * as actions from "../../../../../../../actions/user";
import EthAlert from "../../../../../../../components/EthAlert";
import Alert from "../../../../../../../components/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

class StartGroupForm extends Component {
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
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      working: true
    });
    console.log(this.state.period);

    const [result, error] = await startYourGroup(
      this.props.ethereum.web3,
      this.props.group.contract
    );
    if (result) {
      let msg = "User removed successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        working: false
      });
    } else {
      let msg =
        "Starting group failed, please sure make sure the group is not already start.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        working: false
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { groupName, working, members, subgroups } = this.state;

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
              This group must have at least 50 members before you can start the
              group.
            </Typography>
          </div>
          <Divider variant="middle" />
          <div className={classes.section2}>
            <Typography gutterBottom variant="body1">
              Total Members &nbsp;{" "}
              <Chip className={classes.chip} label={members} />
            </Typography>
          </div>

          <div className={classes.section2}>
            <Typography gutterBottom variant="body1">
              Total subgroups &nbsp;{" "}
              <Chip className={classes.chip} label={subgroups} />
            </Typography>
          </div>

          <div className={classes.section3}>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={this.state.working == true || this.state.period > 0}
              >
                {this.state.working && (
                  <span>
                    {" "}
                    <CircularProgress size={24} /> Starting...
                  </span>
                )}
                {!this.state.working && <small> Start Group</small>}
              </Button>
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
)(withStyles(styles, { withTheme: true })(StartGroupForm));
