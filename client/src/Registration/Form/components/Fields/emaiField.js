import React from "react";
import { TextField } from "@material-ui/core";
function EmailField(props) {
	const { emailError, currEmail, handleEmailChange } = props;
	if (emailError) {
		return (
			<TextField
				variant="outlined"
				error
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				name="email"
				autoComplete="email"
				onChange={handleEmailChange}
				value={currEmail}
			/>
		);
	} else {
		return (
			<TextField
				variant="outlined"
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				name="email"
				autoComplete="email"
				onChange={handleEmailChange}
				value={currEmail}
			/>
		);
	}
}

export default EmailField;
