import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import styles from "../../Nav/SideBar/sidebar.style";
const Help2 = (props) => {
	const { classes } = props;
	
	
	return (
		<main className={classes.content}>
			<div className={classes.toolbar} />
			<Typography variant="h2">User Help page</Typography>
		</main>
	);
};

export default withStyles(styles, { withTheme: true })(Help2);
