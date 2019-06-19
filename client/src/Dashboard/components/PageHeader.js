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
import { darken } from "@material-ui/core/styles";
const PageHeader = (props) => {
	const { classes, title, buttons, role } = props;
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
					{buttons.map((button, index) => {
						if (button.role === "secretary" && role === "policyholder") {
							return null;
						}
						if (button.url !== undefined) {
							return (
								<Button
									variant="contained"
									className={clsx({
										[classes.buttonGreen]: button.type === "green",
										[classes.buttonRed]: button.type === "red",
										[classes.buttonBlue]: button.type === "blue"
									})}
									to={button.url}
									component={RegLink}
									key={index}
								>
									{button.text}
								</Button>
							);
						} else {
							return (
								<Button
									variant="contained"
									className={clsx({
										[classes.buttonGreen]: button.type === "green",
										[classes.buttonRed]: button.type === "red",
										[classes.buttonBlue]: button.type === "blue"
									})}
									disabled={button.disabled}
									key={index}
									onClick={button.handleClick}
								>
									{button.text}
								</Button>
							);
						}
					})}
				</Grid>
			</Grid>
			<Divider className={classes.divider} />
		</React.Fragment>
	);
};

const RegLink = React.forwardRef((props, ref) => (
	<Link innerRef={ref} {...props} />
));

const styles = (theme) => ({
	title: {
		color: "black"
	},
	link: {
		textDecoration: "none",
		color: "inherit"
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "space-around",
		[theme.breakpoints.down("xs")]: {
			flexDirection: "column"
		}
	},
	buttonGreen: {
		width: theme.spacing(20),
		backgroundColor: theme.palette.button.main,
		color: "white",
		borderRadius: "0",
		"&:hover": {
			backgroundColor: darken(theme.palette.button.main, 0.1)
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: theme.spacing(3)
		}
	},
	buttonRed: {
		width: theme.spacing(20),
		backgroundColor: theme.palette.error.main,
		color: "white",
		borderRadius: "0",
		"&:hover": {
			backgroundColor: darken(theme.palette.error.main, 0.1)
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: theme.spacing(3)
		}
	},
	buttonBlue: {
		width: theme.spacing(20),
		backgroundColor: theme.palette.primary.main,
		color: "white",
		borderRadius: "0",
		"&:hover": {
			backgroundColor: darken(theme.palette.primary.main, 0.1)
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: theme.spacing(3)
		}
	},
	divider: {
		width: "100%",
		color: "black",
		marginTop: theme.spacing(3)
	}
});

export default withStyles(styles, { withTheme: true })(PageHeader);
