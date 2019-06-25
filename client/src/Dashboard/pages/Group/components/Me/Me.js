import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";

import styles from "./Me.style.js";
import * as actions from "../../../../../actions";

const Me = (props) => (
    <Typography variant="h4">Me</Typography>
);

function mapStateToProps(state) {
    return {}
}

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(Me));
