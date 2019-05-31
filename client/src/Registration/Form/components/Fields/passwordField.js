import React from "react";
import { TextField } from "@material-ui/core";
function PasswordField(props) {
  const { password, passwordError, handlePasswordChange } = props;
  if (passwordError) {
    return (
      <TextField
        variant="outlined"
        margin="normal"
        error
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={handlePasswordChange}
        value={password}
      />
    );
  } else {
    return (
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={handlePasswordChange}
        value={password}
      />
    );
  }
}

export default PasswordField;
