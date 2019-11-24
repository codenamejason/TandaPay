import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import * as actions from "../../../../../../../actions";
import styles from "./Myself.style.js";

const Myself = ({ classes, group }) => (
  <div>
    <Typography variant="h4">Me</Typography>
    <div className={classes.main}>
      <div>
        <Typography variant="body1">
          <Bold>Ms. Some User</Bold>
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
        <Button className={classes.spaced} variant="outlined" color="secondary">
          Group Files
        </Button>
      </div>
      <div className={classes.right}>
        {/* <Typography variant="body1">Next Payment 04/29/2019</Typography> */}
        <Button
          className={classes.spaced}
          variant="contained"
          color="primary"
          to="/holder/payments/new"
          component={RegLink}
        >
          Make Payment
        </Button>
      </div>
    </div>
  </div>
);

const Bold = withStyles(styles, {
  withTheme: true
})(({ classes, children }) => <span className={classes.bold}>{children}</span>);

function mapStateToProps({ group }) {
  return { group };
}
const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));
export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(Myself));
