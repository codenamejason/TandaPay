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

import { getActivePeriod, isParticipant } from "../../../../../web3";
class ManageUser extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      loading: true,
      newUser: null,
      subgroupIndex: "null",
      status: "N/A"
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

      try {
        const { groupName, members, subgroups } = this.props.group;
        const [period, error] = await getActivePeriod(
          this.props.ethereum.web3,
          this.props.group.contract
        );

        if (!error) {
          try {
            const [rs_status, error] = await isParticipant(
              this.props.ethereum.web3,
              this.props.group.contract,
              period,
              utilReducer.OtherUser.ethereumAddress
            );

            if (rs_status > 0) {
              this.setState({
                status: "Finalized"
              });
            } else {
              this.setState({
                status: " No response"
              });
            }
          } catch (e) {}
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

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
                    <br></br>
                    <Typography variant="h6">
                      Status: <b>{this.state.status}</b>
                    </Typography>
                  </div>
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

function mapStateToProps({ group, utilReducer }) {
  return { group, utilReducer };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(ManageUser))
);
