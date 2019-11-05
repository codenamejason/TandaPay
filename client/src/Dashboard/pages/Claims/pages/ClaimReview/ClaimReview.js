import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Grid, Typography, withStyles } from "@material-ui/core";
import * as actions from "../../../../../actions";
import PageHeader from "../../../../components/PageHeader/PageHeader";

import data from "../../../../../data/claims.json";
import styles from "./review.style";
import ProfileCard from "./components/ProfileCard";
import ClaimDocs from "./components/ClaimDocs";
import { submitClaimToSmartContract } from "../../../../../web3";
class ClaimReview extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { match, claims } = this.props;

    const claimID = match.params.id;
    let claim;

    for (var x in claims) {
      if (claims[x]._id === claimID) {
        claim = claims[x];
      }
    }
    console.log(claim, "the claim");

    this.setState({
      claim,
      claimID
    });
  }
  render() {
    const headerButtons = [
      {
        text: "REJECT",
        type: "red",
        handleClick: this.handleClaimReject,
        role: "secretary"
      },
      {
        text: "APPROVE",
        type: "green",
        handleClick: this.handleClaimApproval,
        role: "secretary"
      }
    ];
    const { classes, user } = this.props;
    const { claim } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title="Claim Overview"
          buttons={headerButtons}
          role={user.role}
        />
        <Grid container className={classes.topSection}>
          <ProfileCard claim={claim} />
          <Grid item xs={12} sm={6}>
            <Typography variant="h3">Summary</Typography>
            <Typography variant="body1">{claim.summary}</Typography>
          </Grid>
        </Grid>
        <ClaimDocs />
      </React.Fragment>
    );
  }

  /**
   * @summary
   */
  handleClaimReject = () => {
    this.props.denyClaim(this.state.claimID);
    this.props.history.push("/admin/claims");
  };

  /**
   *
   */
  handleClaimApproval = async () => {
    const [result, error] = await submitClaimToSmartContract(
      this.props.ethereum.web3,
      this.props.ethereum.TGP,
      this.state.claim.period,
      this.state.claim.claimantAddress
    );
    console.log(result, error);
    if (!error) {
      await this.props.approveClaim(this.state.claimID);

      this.props.history.push("/admin/claims");
    } else {
      alert("Error ");
    }
  };
}

function mapStateToProps({ user, claims, ethereum }) {
  return { user, claims, ethereum };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(ClaimReview))
);
