import React from "react";
import { Grid, withStyles } from "@material-ui/core";

import ClaimCard from "../ClaimCard/ClaimCard";

import styles from "./recent.style.js";
const RecentClaims = (props) => {
	const { classes, claims } = props;
	return (
		<Grid container className={classes.claimContainer}>
			{claims.map((claim, index) => (
				<Grid item xs={12} sm={3} key={index}>
					<ClaimCard claim={claim} />
				</Grid>
			))}
		</Grid>
	);
};

export default withStyles(styles, { withTheme: true })(RecentClaims);
