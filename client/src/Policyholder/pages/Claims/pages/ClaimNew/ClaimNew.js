import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { PageHeader } from "../../../../components/";
import * as actions from "../../../../../actions";
import styles from "./new.style.js";
import FileUpload from "./components/FileUpload";
import SummaryField from "./components/SummaryField";
import AmountField from "./components/AmountField";
import Alert from "../../../../../components/Alert";
import { setAlert } from "../../../../../actions/alert";
import { getActivePeriod } from "../../../../../web3";

class ClaimNew extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      files: [],
      documents: [],
      summary: "",

      sumitting: false
    };
  }

  handleClaimSubmit = async () => {
    this.setState({ sumitting: true });

    const { files, summary, documents } = this.state;

    const [period, error] = await getActivePeriod(
      this.props.ethereum.web3,
      this.props.group.contract
    );

    if (!error && parseFloat(period) > 0) {
      for (var i = 0; i < files.length; i++) {
        documents.push(files[i]["name"]);
      }
      await this.props.createClaim(
        summary,
        documents,
        parseFloat(period),
        this.props.user.ethereumAddress
      );

      this.setState({
        files: [],
        documents: [],
        summary: "",

        sumitting: false
      });
    } else {
      alert("Group has not started");
      this.setState({ sumitting: false });
    }
  };
  displayGuide = guideURL => {
    // window.open(guideURL, "_blank");
  };

  handleFileUpload = event => {
    this.setState({
      documents: [],
      files: event.target.files
    });
  };

  handleSummaryUpdate = event => {
    this.setState({
      summary: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { summary, files, sumitting } = this.state;
    const headerButtons = [
      {
        text: "VIEW GUIDE",
        type: "blue",
        url: "/holder/claims/guide"
      },
      { text: "CANCEL", type: "red", url: "/holder/claims" },
      {
        text: "SUBMIT",
        type: "green",
        handleClick: this.handleClaimSubmit,
        disabled: summary === "" || files.length === 0 || sumitting === true
      }
    ];
    return (
      <React.Fragment>
        <PageHeader title="Create New Claim" buttons={headerButtons} />
        <Alert />
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={6}>
            <SummaryField
              value={summary}
              handleUpdate={this.handleSummaryUpdate}
            />
          </Grid>

          <FileUpload onUpload={this.handleFileUpload} files={files} />
        </Grid>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ claims, ethereum, user, group }) {
  return { claims, ethereum, user, group };
}
export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(ClaimNew))
);
