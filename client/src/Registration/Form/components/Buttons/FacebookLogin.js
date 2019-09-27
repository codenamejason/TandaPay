import React from "react";
import { withStyles, Link } from "@material-ui/core";
import { FacebookLoginButton } from "react-social-login-buttons";
import styles from "./button.style";
function FacebookLogin(props) {
	const { classes } = props;
	return (
		<FacebookLoginButton iconSize="20px" size="40px">
			<Link href={"/auth/facebook"} color="inherit" className={classes.link}>
				Sign up with Facebook
			</Link>
		</FacebookLoginButton>
	);
}
///     <FacebookButton iconSize="50px" size="100px">
//<span style={{ fontSize: 10 }}>Login with facebook</span>
//</FacebookButton>
export default withStyles(styles, { withTheme: true })(FacebookLogin);
