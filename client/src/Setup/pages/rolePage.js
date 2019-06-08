import React from "react";
import clsx from "clsx";
import {
	Grid,
	Typography,
	withStyles,
	IconButton,
	Button,
	TextField
} from "@material-ui/core";
import { Person, AssignmentTurnedIn } from "@material-ui/icons";
import styles from "../setup.style";
class RolePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			role: "",
			accessCode: ""
		};
	}

	render() {
		const { classes } = this.props;
		const { role, accessCode } = this.state;
		return (
			<div>
				<Typography variant="h3" className={classes.title}>
					How will you be using TandaPay?
				</Typography>
				<Grid container>
					<Grid item xs={6} className={classes.area}>
						<IconButton
							name="policyholder"
							id="policyholder"
							className={clsx(classes.iconButton, {
								[classes.buttonSelected]: role === "policyholder"
							})}
							onClick={this.onPolicyClick}
						>
							<Person
								className={clsx(classes.icon, {
									[classes.iconSelected]: role === "policyholder"
								})}
							/>
						</IconButton>
						<Typography variant="caption" className={classes.subtitle}>
							As a policyholder
						</Typography>
						{this.renderCodeField()}
					</Grid>
					<Grid item xs={6} className={classes.area}>
						<IconButton
							disableRipple
							className={clsx(classes.iconButton, {
								[classes.buttonSelected]: role === "secretary"
							})}
							onClick={this.onSecretaryClick}
						>
							<AssignmentTurnedIn
								className={clsx(classes.icon, {
									[classes.iconSelected]: role === "secretary"
								})}
							/>
						</IconButton>
						<Typography variant="caption" className={classes.subtitle}>
							As a secretary
						</Typography>
					</Grid>
				</Grid>
				<Grid container className={classes.buttonGroup}>
					<Grid item xs={6} className={classes.cancelButton}>
						<Button
							variant="contained"
							className={clsx(classes.button, classes.cancel)}
							onClick={this.props.previousPage}
						>
							Cancel
						</Button>
					</Grid>
					<Grid item xs={6} className={classes.nextButton}>
						<Button
							variant="contained"
							color="primary"
							className={clsx(classes.button, classes.next)}
							onClick={() => this.props.onPageSubmit(role, accessCode)}
						>
							Next
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}
	renderCodeField = () => {
		if (this.state.role !== "policyholder") {
			return;
		}
		const { accessCode } = this.state;
		return (
			<TextField
				id="access-code"
				label="Access Code"
				type="text"
				value={accessCode}
				onChange={this.handleCodeChange}
				margin="normal"
				variant="outlined"
			/>
		);
	};

	handleCodeChange = (event) => {
		this.setState({
			accessCode: event.target.value
		});
	};
	onPolicyClick = () => {
		const { role } = this.state;
		if (role !== "policyholder") {
			this.setState({
				role: "policyholder"
			});
		}
	};

	onSecretaryClick = () => {
		const { role } = this.state;
		if (role !== "secretary") {
			this.setState({
				role: "secretary"
			});
		}
	};
}

export default withStyles(styles, { withTheme: true })(RolePage);
