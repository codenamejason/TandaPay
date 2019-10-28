import React from "react";
import { withStyles, Grid, TextField } from "@material-ui/core";
import styles from "../new.style";
const SummaryField = props => {
  const { handleUpdate, classes, value } = props;

  return (
    <TextField
      className={classes.summary}
      id="summaryField"
      multiline
      margin="normal"
      variant="outlined"
      value={value}
      onChange={handleUpdate}
      label="Incident Summary"
      rows="7"
      rowsMax="8"
      placeholder="Type out a short paragraph(s) long summary about the incident"
    />
  );
};

export default withStyles(styles, { withTheme: true })(SummaryField);
