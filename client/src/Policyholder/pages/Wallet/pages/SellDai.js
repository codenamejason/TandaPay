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
import styles from "./sellDai.style";
import EthAlert from "../../../../components/EthAlert";
import Alert from "../../../../components/Alert";
import * as actions from "../../../../actions/user";
import Avatar from "react-avatar";

import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";

import FormControl from "@material-ui/core/FormControl";
import {
  addPolicyHolderToSmartContract,
  removePolicyHolderFromSmartContract,
  sendDaiToUser,
  tranferDaiToUser
} from "../../../../web3";
class SellDai extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      loading: true,
      newUser: null,

      value: 0,
      submitting: false
    };
  }

  myChangeHandler = event => {
    this.setState({ value: event.target.value });
  };

  async componentDidMount() {
    const { match } = this.props;
    const user_id = match.params.email;

    await this.props.fetchUserByEmail(user_id);
    const { utilReducer } = this.props;

    if (utilReducer.OtherUser.name != "") {
      this.setState({
        loading: false,

        newUser: utilReducer.OtherUser
      });
    }
  }

  sendDai = async () => {
    this.setState({
      submitting: true
    });
    const [result, error] = await tranferDaiToUser(
      this.props.ethereum.web3,
      this.props.ethereum.DAI,
      this.state.value,
      this.state.newUser.ethereumAddress
    );

    if (result) {
      await this.props.sendTransfer(
        this.props.user._id,
        this.state.newUser._id,
        this.state.value,
        "Sell",
        this.state.newUser.name,
        this.props.user.name,
        result.transactionHash
      );
      let msg = "Dai sent  successfully.";
      let type = "success";
      let hash = result.transactionHash;
      this.props.dispatchEthCustomMessage({ msg, type, hash });
      this.setState({
        submitting: false,
        value: 0
      });
    } else {
      let msg = "Sending Dai failed.";
      let type = "danger";
      this.props.dispatchCustomMessage({ msg, type });
      this.setState({
        submitting: false
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

                    <TextField
                      style={{ marginBottom: "20px" }}
                      value={utilReducer.OtherUser.ethereumAddress}
                      label="Wallet Address:"
                      id="filled-start-adornment"
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">ETH</InputAdornment>
                        )
                      }}
                      variant="filled"
                    />

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
                        value={this.state.value}
                        onChange={this.myChangeHandler}
                        startAdornment={
                          <InputAdornment position="start">DAI</InputAdornment>
                        }
                        labelWidth={60}
                      />
                    </FormControl>
                  </div>
                  <div>
                    {/* <Typography variant="body1" className={classes.standing}>
                      {utilReducer.OtherUser.standing.toUpperCase()} STANDING
                    </Typography> */}
                  </div>

                  <Button
                    style={{ marginBottom: "40px", marginTop: "10px" }}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={this.sendDai}
                    disabled={
                      this.state.submitting == true || this.state.value <= 0
                    }
                  >
                    {this.state.submitting && (
                      <span>
                        {" "}
                        <CircularProgress size={24} /> Selling...
                      </span>
                    )}
                    {!this.state.submitting && <small> Sell Dai</small>}
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

function mapStateToProps({ group, utilReducer, ethereum, user }) {
  return { group, utilReducer, ethereum, user };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(SellDai))
);
