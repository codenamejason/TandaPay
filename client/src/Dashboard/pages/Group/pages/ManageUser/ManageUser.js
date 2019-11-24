import React from "react";
import clsx from "clsx";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Typography,
  Card,
  Button,
  Grid,
  TextField,
  Divider
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import styles from "./manageUser.style";
import EthAlert from "../../../../../components/EthAlert";
import Alert from "../../../../../components/Alert";
import * as actions from "../../../../../actions/user";
import Avatar from "react-avatar";

import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";

import FormControl from "@material-ui/core/FormControl";
import {
  addPolicyHolderToSmartContract,
  removePolicyHolderFromSmartContract,
  sendDaiToUser,
  tranferDaiToUser
} from "../../../../../web3";
class ManageUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      newUser: null,
      subgroupIndex: "null",
      mintValue: 0,
      sendValue: 0,
      submitting: false,
      removeBtnsubmitting: false,
      addedToSmartContract: false,
      sendDaiBtn: false,
      mintDaiBtn: false
    };
  }

  myChangeHandler = event => {
    this.setState({ mintValue: event.target.value });
  };

  sendChangeHandler = event => {
    this.setState({ sendValue: event.target.value });
  };
  async componentDidMount() {
    const { match } = this.props;
    const user_id = match.params.id;
    await this.props.fetchUserByID(user_id);
    const { utilReducer } = this.props;
    if (utilReducer.OtherUser.name != "") {
      let userSubgroupIndex = "null";
      let statusCheck = false;
      this.props.group.subgroups.forEach(function(subgroupElem, subgroupIndex) {
        subgroupElem.members.forEach(function(
          subgroupMemberElem,
          subgroupMemberIndex
        ) {
          if (
            subgroupMemberElem.id.toString() ==
            utilReducer.OtherUser._id.toString()
          ) {
            userSubgroupIndex = subgroupIndex + 1;
          }

          if (utilReducer.OtherUser.addedToSmartContract !== undefined) {
            statusCheck = utilReducer.OtherUser.addedToSmartContract;
          }
        });
      });
      this.setState({
        loading: false,

        isUserAdded: false,
        newUser: utilReducer.OtherUser,
        subgroupIndex: userSubgroupIndex,
        addedToSmartContract: statusCheck
      });
    }
  }

  addUser = async () => {
    this.setState({
      submitting: true
    });
    const [result, error] = await addPolicyHolderToSmartContract(
      this.props.ethereum.web3,

      this.state.newUser.ethereumAddress,
      this.state.subgroupIndex,
      this.props.group.contract
    );

    if (result) {
      await this.props.updateUserSmartContractStatus(
        this.state.newUser._id,
        true
      );
      let msg = "User added successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        submitting: false,
        subgroupIndex: "null"
      });
    } else {
      let msg =
        "Adding user failed, please make you have not added this user before.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        submitting: false
      });
    }

    //console.log(result._address, error);
  };
  sendDai = async () => {
    this.setState({
      sendDaiBtn: true
    });
    const [result, error] = await tranferDaiToUser(
      this.props.ethereum.web3,
      this.props.ethereum.DAI,
      this.state.sendValue,
      this.state.newUser.ethereumAddress
    );

    if (result) {
      await this.props.sendTransfer(
        this.props.user._id,
        this.state.newUser._id,
        this.state.sendValue,
        "Send",
        this.state.newUser.name,
        this.props.user.name,
        result.transactionHash
      );
      let msg = "Dai sent  successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        sendDaiBtn: false,
        sendValue: 0
      });
    } else {
      let msg = "Sending Dai failed.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        sendDaiBtn: false
      });
    }
  };

  mintDai = async () => {
    this.setState({
      mintDaiBtn: true
    });
    const [result, error] = await sendDaiToUser(
      this.props.ethereum.web3,
      this.props.ethereum.DAI,
      this.state.mintValue,
      this.props.user.ethereumAddress
    );

    if (result) {
      let msg = "successfully minted " + this.state.mintValue + " DAI Token";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        mintDaiBtn: false
      });
      this.setState({
        mintValue: 0
      });
    } else {
      let msg = "Minting failed.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        mintDaiBtn: false
      });
    }
  };

  removeUser = async () => {
    this.setState({
      removeBtnsubmitting: true
    });
    const [result, error] = await removePolicyHolderFromSmartContract(
      this.props.ethereum.web3,
      this.state.newUser.ethereumAddress,
      this.props.group.contract
    );

    if (result) {
      await this.props.updateUserSmartContractStatus(
        this.state.newUser._id,
        false
      );
      let msg = "User removed successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        removeBtnsubmitting: false,
        subgroupIndex: "null"
      });
    } else {
      let msg =
        "Adding user failed, please make you have not this user before.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        removeBtnsubmitting: false,
        subgroupIndex: "null"
      });
    }
  };

  render() {
    let { utilReducer, classes } = this.props;
    const { loading } = this.state;

    if (!loading) {
      return (
        <div id="members">
          <Grid item xs={12} sm={6}>
            <Grid container component={Card} className={classes.overview}>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <div className={classes.profileContainer}>
                  <div>
                    <Typography variant="subtitle1">
                      {utilReducer.OtherUser.name}
                    </Typography>
                    <Typography variant="caption">Email:</Typography>
                    <Typography variant="subtitle2">
                      {" "}
                      {utilReducer.OtherUser.email}
                    </Typography>

                    <Typography variant="h6">
                      <TextField
                        value={utilReducer.OtherUser.ethereumAddress}
                        label="Wallet Address:"
                        id="filled-start-adornment"
                        className={clsx(classes.margin, classes.textField)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              ETH
                            </InputAdornment>
                          )
                        }}
                        variant="filled"
                      />
                    </Typography>
                  </div>
                  <div>
                    {/* <Typography variant="body1" className={classes.standing}>
                      {utilReducer.OtherUser.standing.toUpperCase()} STANDING
                    </Typography> */}
                  </div>

                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={this.addUser}
                    disabled={
                      this.state.subgroupIndex == "null" ||
                      this.state.submitting == true ||
                      this.state.addedToSmartContract == true
                    }
                  >
                    {this.state.submitting && (
                      <span>
                        {" "}
                        <CircularProgress size={24} /> adding...
                      </span>
                    )}
                    {!this.state.submitting && <small> Add User</small>}
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={this.removeUser}
                    disabled={
                      this.state.subgroupIndex == "null" ||
                      this.state.removeBtnsubmitting == true ||
                      this.state.addedToSmartContract == false
                    }
                  >
                    {this.state.removeBtnsubmitting && (
                      <span>
                        {" "}
                        <CircularProgress size={24} /> removing...
                      </span>
                    )}
                    {!this.state.removeBtnsubmitting && (
                      <small> Remove User</small>
                    )}
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.imageContainer}>
                  <Avatar name={utilReducer.OtherUser.name} />
                  {/* <img
                    src="#"
                    alt="The provided user profile"
                    className={classes.img}
                  /> */}
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid className={classes.overview} container>
            <Grid item sm={6} xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="subtitle1">Mint Test DAI</Typography>

                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    value={this.state.mintValue}
                    onChange={this.myChangeHandler}
                    startAdornment={
                      <InputAdornment position="start">DAI</InputAdornment>
                    }
                    labelWidth={60}
                  />
                </FormControl>

                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={this.mintDai}
                  disabled={this.state.mintDaiBtn == true}
                >
                  {this.state.mintDaiBtn && (
                    <span>
                      {" "}
                      <CircularProgress size={24} /> Minting...
                    </span>
                  )}
                  {!this.state.mintDaiBtn && <small> Mint DAI</small>}
                </Button>
              </Paper>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="subtitle1">
                  Send Dai to <b>{utilReducer.OtherUser.name}</b>
                </Typography>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    value={this.state.sendValue}
                    onChange={this.sendChangeHandler}
                    startAdornment={
                      <InputAdornment position="start">DAI</InputAdornment>
                    }
                    labelWidth={60}
                  />
                </FormControl>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={this.sendDai}
                  disabled={this.state.sendDaiBtn == true}
                >
                  {this.state.sendDaiBtn && (
                    <span>
                      {" "}
                      <CircularProgress size={24} /> Send...
                    </span>
                  )}
                  {!this.state.sendDaiBtn && <small>Send DAI</small>}
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <EthAlert />
          <Alert />
        </div>
      );
    } else if (loading) {
      return (
        <div id="members">
          <Typography variant="h4">Loading user...</Typography>
        </div>
      );
    }
  }
}

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function mapStateToProps({ group, utilReducer }) {
  return { group, utilReducer };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(ManageUser))
);
