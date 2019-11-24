import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
import Create from "../Create/Create";
import SubgroupCard from "./SubgroupCard";
import styles from "./Subgroup.style.js";
import * as actions from "../../../../../../../actions";

const Subgroup = ({ classes }) => (
  <div>
    <Typography variant="h4">Subgroup</Typography>
    <SubgroupCard />
    <div className={classes.main}>
      <Create />
    </div>
  </div>
);

const BigText = withStyles(styles, { withTheme: true })(
  ({ classes, children, className }) => (
    <div className={classes.bigText + " " + className}>{children}</div>
  )
);

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(Subgroup));
