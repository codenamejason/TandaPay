import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography, Button, Grid, Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Loader from "../../../../../../../components/Loader";
import styles from "../Members/Members.style.js";
import * as actions from "../../../../../../../actions";
import EthAlert from "../../../../../../../components/EthAlert";
import Alert from "../../../../../../../components/Alert";
import {
  finalizeGroupCreationWeb3,
  getPastEvent,
  getGroup,
  isSecretary
} from "../../../../../../../web3";
class FinalizeGroupCreation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submiting: false,
      success: "",
      paper: "classes.paper2",
      loading: true,
      tHash: "",
      hasNoGroup: true
    };
    this.finslizeCreation = this.finslizeCreation.bind(this);
  }

  async componentDidMount() {
    const [isSec, error] = await isSecretary(
      this.props.ethereum.web3,
      this.props.ethereum.TGP,
      this.props.user.ethereumAddress
    );
    console.log(isSec, error, "This Past Events");

    if (isSec > 0) {
      const [groupAddress, error] = await getGroup(
        this.props.ethereum.web3,
        this.props.ethereum.TGP,
        isSec
      );

      if (!error) {
        let rs = this.props.addGroupContractAddress(groupAddress);

        rs.then(s => {});
      }
    } else {
      this.setState({
        loading: false
      });
    }
  }

  finslizeCreation = async () => {
    this.setState({
      submiting: true
    });
    const [result, error] = await finalizeGroupCreationWeb3(
      this.props.ethereum.web3,
      this.props.ethereum.TGP,
      this.props.group.premium,
      this.props.group.allowedClaims
    );
    if (result) {
      let msg = "Group created successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
    } else {
      let msg = "Group creation failed refresh the page and try again.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
    }
  };

  render() {
    let { group, classes } = this.props;
    console.log(this.state.loading, this.state.hasNoGroup, "Uncle jumbol");

    return (
      <div className={classes.root}>
        {!this.state.loading && this.state.hasNoGroup ? (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <h1>Finalize group creation</h1>
                <p>
                  Before you can be able to invite members, you'll need to click
                  the Finalize button below to get your group ready
                </p>
                <Divider />
                <h2>Group Name:</h2>
                <p>{group.groupName}</p>
                <h2>Allowed Claims:</h2>
                <p>{group.allowedClaims}</p>
                <h2>Premium:</h2>
                <p>{group.premium}</p>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.finslizeCreation}
                >
                  Finalize
                </Button>
              </Paper>
              <Alert />
              <EthAlert />
            </Grid>
          </Grid>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

function mapStateToProps({ group, ethereum, user }) {
  return { group, ethereum, user };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(FinalizeGroupCreation));
