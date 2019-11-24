import React from "react";
import { CssBaseline, Grid, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../actions";
import { WalletPage, RolePage, Tos } from "./pages";
import styles from "./setup.style";

class Setup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: "",
      groupName: "",
      charterID: "",
      accessCode: "",
      walletProvider: "",
      ethAddress: "",
      page: 0
    };
  }
  onRoleSubmit = (role, accessCode) => {
    if (role == "policyholder") {
      this.props
        .checkAccessCode({ accessCode })
        .then(rs => {
          if (rs.isLegit == true) {
            this.setState({
              groupName: rs.groupName,
              charterID: rs.charterID,
              role,
              accessCode,
              page: 1
            });
          } else {
            let msg = "Invalid access code";
            let type = "danger";
            this.props.dispatchCustomMessage({ msg, type });
          }
        })
        .catch(error => {});
    } else {
      this.setState({
        role,
        accessCode,
        page: 2
      });
    }
  };

  handleOnAggree = () => {};
  onTosSubmit = aggreed => {
    if (aggreed) {
      this.setState({
        page: 2
      });
    }
  };
  onWalletSubmit = (walletProvider, ethAddress) => {
    this.setState({
      walletProvider,
      ethAddress
    });
    const { role, accessCode, groupName, charterID } = this.state;
    localStorage.groupCreated = role === "policyholder" ? "yes" : "no";
    //call action creator
    this.props.completeAccount({
      role,
      accessCode,
      walletProvider,
      ethAddress
    });
  };
  handlePrevious = () => {
    const { page } = this.state;
    const { user } = this.props;
    if (page === 0) {
      //cancel user
      this.props.cancelAccount({ user });
    } else {
      this.setState({
        page: 0
      });
    }
  };
  render() {
    const { classes } = this.props;
    const { page, role, accessCode, groupName, charterID } = this.state;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />

        {page === 0 && (
          <RolePage
            onPageSubmit={this.onRoleSubmit}
            previousPage={this.handlePrevious}
            role={role}
            accessCode={accessCode}
          />
        )}
        {page === 1 && (
          <Tos
            groupName={groupName}
            charterID={charterID}
            onPageSubmit={this.onTosSubmit}
            previousPage={this.handlePrevious}
          />
        )}
        {page === 2 && (
          <WalletPage
            onPageSubmit={this.onWalletSubmit}
            previousPage={this.handlePrevious}
          />
        )}
      </Grid>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}
export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(Setup));
