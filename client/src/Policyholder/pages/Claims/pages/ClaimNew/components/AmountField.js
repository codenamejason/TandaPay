import React from "react";
import { withStyles, Grid, TextField } from "@material-ui/core";
import styles from "../new.style";
const AmountField = props => {
  const { handleUpdate, classes, value } = props;

  return (
    <TextField
      className={classes.amount}
      id="amountField"
      margin="normal"
      variant="outlined"
      value={value}
      type="number"
      onChange={handleUpdate}
      label="Claim Amount"
      placeholder="Enter claim amount"
    />
  );
};

export default withStyles(styles, { withTheme: true })(AmountField);
