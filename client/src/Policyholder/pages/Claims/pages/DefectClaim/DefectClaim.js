import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "./defect.style";
import EthAlert from "../../../../../components/EthAlert";
import Alert from "../../../../../components/Alert";
import * as actions from "../../../../../actions/group";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { BrowserRouter as Router, Link } from "react-router-dom";

import { getActivePeriod, defectClaim } from "../../../../../web3";
class DefectClaim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      working: false,
      paying: false,

      period: "N/A"
    };
  }
  async componentDidMount() {
    try {
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

    const [result, error] = await defectClaim(
      this.props.ethereum.web3,
      this.state.period,
      this.props.group.contract
    );
    if (result) {
      let msg = "Defected successfully";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        paying: false
      });
    } else {
      console.log(error);

      this.setState({
        paying: false
      });
      let msg = "Failed. try again later.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
    }
  };

  render() {
    const { classes } = this.props;
    const { period } = this.state;
    const headerButtons = [
      {
        text: "GO BACK",
        type: "red",
        url: "/holder/claims"
      },
      {
        text: "DEFECTION GUIDE",
        type: "green",
        url: "/holder/claims/defect/guide"
      }
    ];
    return (
      <React.Fragment>
        <PageHeader title="Defect Claim" buttons={headerButtons} />
        <div className={classes.root}>
          <div className={classes.section1}>
            <Typography color="textSecondary" variant="body2">
              Are you sure you want to defect period <b>{period} </b>? Please
              read the
              <Link to="/holder/claims/defect/guide">
                {" "}
                <b>Understanding Defections Guide</b>
              </Link>{" "}
              before defecting payment
            </Typography>
          </div>
          <Divider variant="middle" />

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
                  <CircularProgress size={24} /> Defecting...
                </span>
              )}
              {!this.state.paying && <small> Defect Claim</small>}
            </Button>
            &nbsp;
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
)(withStyles(styles, { withTheme: true })(DefectClaim));
