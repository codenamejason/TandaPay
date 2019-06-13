import React from "react";
import {
	Grid,
	withStyles,
	Typography,
	Button,
	Divider
} from "@material-ui/core";
import { Link } from "react-router-dom";

import styles from "./header.style.js";
const ClaimHeader = (props) => {
	const { classes } = props;
	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={12} sm={10}>
					<Typography variant="h3" className={classes.title}>
						Claims Pages
					</Typography>
				</Grid>
				<Grid item xs={12} sm={2} className={classes.buttonContainer}>
					<Button
						variant="contained"
						className={classes.button}
						to="/admin/claims/new"
						component={RegLink}
					>
						NEW CLAIM
					</Button>
				</Grid>
			</Grid>
			<Divider className={classes.divider} />
		</React.Fragment>
	);
};

const RegLink = React.forwardRef((props, ref) => (
	<Link innerRef={ref} {...props} />
));

export default withStyles(styles, { withTheme: true })(ClaimHeader);
