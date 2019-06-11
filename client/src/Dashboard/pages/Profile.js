import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import styles from "../../Navigation/SideBar/sidebar.style";
const Profile = (props) => {
	const { classes } = props;
	return (
		<main className={classes.content}>
			<div className={classes.toolbar} />
			<Typography variant="h2">Profile Pages</Typography>
		</main>
	);
};

export default withStyles(styles, { withTheme: true })(Profile);
