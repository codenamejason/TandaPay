import React from "react";
import { withStyles, Grid, TextField } from "@material-ui/core";
import styles from "../new.style";
const AmountField = props => {
  const { handleUpdate, classes, value } = props;

  return (
    <Grid item xs={12} sm={6}>
      <TextField
        className={classes.amount}
        id="amountField"
        margin="normal"
        variant="outlined"
        value={value}
        onChange={handleUpdate}
        label="Claim Amount"
        placeholder="Enter claim amount"
      />
    </Grid>
  );
};

export default withStyles(styles, { withTheme: true })(AmountField);
