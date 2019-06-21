import React from "react";
import { Grid, Typography, TextField, withStyles } from "@material-ui/core";
import ButtonGroup from "../components/ButtonGroup/";
import styles from "./group.style.js";

class RolePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { groupName: "", premium: "" };
	}

	render() {
		let { classes } = this.props;
		let { groupName, premium } = this.state;

		let formCompleted = groupName && premium && isValidPremium(premium);

		return (
			<div>
				<Typography variant="h3" className={classes.title}>
					Create a Tanda group
				</Typography>
				<TextField
					id="groupName"
					label="Group Name"
					type="text"
					value={groupName}
					onChange={this.handleFieldChange}
					margin="normal"
					variant="outlined"
					className={classes.groupName}
				/>
				<TextField
					id="premium"
					label="Monthly Premium"
					type="text"
					value={premium}
					onChange={this.handleFieldChange}
					margin="normal"
					variant="outlined"
					className={classes.premium}
				/>
				<ButtonGroup
					handleNext={this.handleNext}
					handlePrevious={this.props.previousPage}
					page={2}
					disabled={!formCompleted}
				/>
			</div>
		);
	}

	handleNext = () => {
		const { groupName, premium } = this.state;
		this.props.onPageSubmit(groupName, premium);
	};

	handleFieldChange = event => {
		this.setState({
			[event.target.id]: event.target.value,
		});
	};
}

function isValidPremium(premium) {
	let n = Number(premium);
	return !isNaN(n) && n > 0;
}

export default withStyles(styles, { withTheme: true })(RolePage);
