import React from "react";
import { withStyles, Link } from "@material-ui/core";
import { GoogleLoginButton } from "react-social-login-buttons";
import styles from "./button.style";
function GoogleLogin(props) {
	const { classes } = props;
	return (
		<GoogleLoginButton iconSize="20px" size="40px">
			<Link href={"/auth/google"} color="inherit" className={classes.link}>
				Sign up with Google
			</Link>
		</GoogleLoginButton>
	);
}

export default withStyles(styles, { withTheme: true })(GoogleLogin);
