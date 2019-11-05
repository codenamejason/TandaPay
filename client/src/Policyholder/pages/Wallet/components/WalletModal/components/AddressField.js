import React from "react";
import TextField from "./styled/TextField";
import { Field } from "react-final-form";
import { InputAdornment } from "@material-ui/core";
import { isNumeric } from "validator";
const validate = value => {
  if (value !== undefined) {
    return undefined;
  } else {
    return "Invalid Address";
  }
};
function AddresField(props) {
  const { address } = props;

  return (
    <Field
      name="address"
      required
      label="Address of Recipient"
      type="text"
      id="amount-field"
      defaultValue={address}
      component={TextField}
      validate={validate}
      InputProps={{
        startAdornment: <InputAdornment position="start">0x</InputAdornment>
      }}
    />
  );
}

export default AddresField;
