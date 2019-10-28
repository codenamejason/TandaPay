import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography, Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import * as actions from "../../../../../../../actions";
import styles from "./Myself.style.js";

const Myself = ({ classes, group, user }) => {
  const { name, email } = user;
  function doJoin(e) {
    alert("e.getTarget");
  }
  return (
    <Fragment>
      <div>
        <Typography variant="h4">Me</Typography>
        <div className={classes.main}>
          <div>
            <Grid container spacing={4}>
              <Grid item md={4}>
                <img
                  src="https://via.placeholder.com/150"
                  className={classes.img}
                  alt="User Profile"
                />
              </Grid>
              <Grid item md={8}>
                <Typography variant="body1">
                  <Bold>{name}</Bold>
                </Typography>
                <Typography variant="body1">
                  <Bold>Subgroup:</Bold> Good Standing
                </Typography>
                <Button
                  className={classes.spaced}
                  variant="contained"
                  color="secondary"
                >
                  Details
                </Button>
                <Button
                  className={classes.spaced}
                  variant="outlined"
                  color="secondary"
                >
                  Group Files
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.right}>
            {/* <Typography variant="body1">Next Payment 04/29/2019</Typography> */}
            {/* <Button
              className={classes.spaced}
              variant="contained"
              color="primary"
              onClick={e => doJoin(e)}
            ></Button> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const Bold = withStyles(styles, { withTheme: true })(
  ({ classes, children }) => <span className={classes.bold}>{children}</span>
);

function mapStateToProps({ group, user }) {
  return { group, user };
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(Myself));
