import React from "react";
import {
	Grid,
	withStyles,
	Typography,
	Button,
	Divider
} from "@material-ui/core";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./header.style.js";
const ClaimHeader = (props) => {
	const { classes, title, buttons } = props;
	const titleSize = 12 - 2 * buttons.length;
	const buttonSize = 2 * buttons.length;
	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={12} sm={titleSize}>
					<Typography variant="h3" className={classes.title}>
						{title}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={buttonSize} className={classes.buttonContainer}>
					{buttons.map((button, index) => (
						<Button
							variant="contained"
							className={clsx({
								[classes.buttonGreen]: button.type === "green",
								[classes.buttonRed]: button.type === "red"
							})}
							to={button.url !== undefined ? "/admin/claims/new" : null}
							component={button.url !== undefined ? RegLink : Button}
							key={index}
							onClick={button.handleClick}
						>
							{button.text}
						</Button>
					))}
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
