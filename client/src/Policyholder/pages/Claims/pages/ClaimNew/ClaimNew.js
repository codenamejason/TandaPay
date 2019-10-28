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

class ClaimNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      documents: [],
      summary: "",
      amount: "",
      sumitting: false
    };
  }

  handleClaimSubmit = () => {
    this.setState({ sumitting: true });
    const { files, summary, documents, amount } = this.state;
    for (var i = 0; i < files.length; i++) {
      documents.push(files[i]["name"]);
    }

    this.props.createClaim(summary, documents, amount);
    this.setState({
      files: [],
      documents: [],
      summary: "",
      amount: "",
      sumitting: false
    });
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

  handleAmountUpdate = event => {
    this.setState({
      amount: event.target.value
    });
  };

  handleSummaryUpdate = event => {
    this.setState({
      summary: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { summary, files, amount, sumitting } = this.state;
    const headerButtons = [
      {
        text: "VIEW GUIDE",
        type: "blue",
        handleClick: this.displayGuide
      },
      { text: "CANCEL", type: "red", url: "/admin/claims" },
      {
        text: "SUBMIT",
        type: "green",
        handleClick: this.handleClaimSubmit,
        disabled:
          summary === "" ||
          files.length === 0 ||
          amount === "" ||
          sumitting === true
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

            <AmountField
              value={amount}
              handleUpdate={this.handleAmountUpdate}
            />
          </Grid>

          <FileUpload onUpload={this.handleFileUpload} files={files} />
        </Grid>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ claims }) {
  return { claims };
}
export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(ClaimNew))
);
