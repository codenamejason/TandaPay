import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography, Card, Button, Grid, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import styles from "./manageUser.style";
import * as actions from "../../../../../actions/user";
import { addPolicyHolderToSmartContract } from "../../../../../web3";
class ManageUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      newUser: null
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const user_id = match.params.id;
    await this.props.fetchUserByID(user_id);
    const { utilReducer } = this.props;
    if (utilReducer.OtherUser.name != "") {
      this.setState({
        loading: false,
        newUser: utilReducer.OtherUser
      });
    }
  }

  addUser = async () => {
    const [result, error] = await addPolicyHolderToSmartContract(
      this.props.ethereum.web3,
      this.props.ethereum.TGP,
      this.state.newUser.ethereumAddress,
      1
    );

    console.log(result, error);
  };
  render() {
    let { utilReducer, classes } = this.props;
    const { loading } = this.state;
    console.log(this.state);

    if (!loading) {
      return (
        <div id="members">
          <Grid item xs={12} sm={6} className={classes.cardContainer}>
            <Grid container component={Card} className={classes.overview}>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <div className={classes.profileContainer}>
                  <div>
                    <Typography variant="h4">
                      {utilReducer.OtherUser.name}
                    </Typography>
                    <Typography variant="caption">Email:</Typography>
                    <Typography variant="h6">
                      {" "}
                      {utilReducer.OtherUser.email}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body1" className={classes.standing}>
                      {utilReducer.OtherUser.standing.toUpperCase()} STANDING
                    </Typography>
                  </div>

                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={this.addUser}
                  >
                    Add User
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.imageContainer}>
                  <img
                    src="#"
                    alt="The provided user profile"
                    className={classes.img}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
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
