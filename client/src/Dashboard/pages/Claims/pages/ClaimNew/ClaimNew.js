import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { ClaimHeader } from "../../components";

import styles from "./new.style.js";
import FileUpload from "./components/FileUpload";
import SummaryField from "./components/SummaryField";

class ClaimNew extends React.Component {
	headerButtons = [
		{ text: "VIEW GUIDE", type: "blue", handleClick: this.displayGuide },
		{ text: "CANCEL", type: "red", url: "/admin/claims" },
		{ text: "SUBMIT", type: "green", handleClick: this.handleClaimSubmit }
	];
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			summary: ""
		};
	}
	handleClaimSubmit = () => {
		console.log("claim submitted");
	};
	displayGuide = (guideURL) => {
		window.open(guideURL, "_blank");
	};

	handleFileUpload = (event) => {
		console.log(event.target.files);
		this.setState({
			files: event.target.files
		});
	};

	handleSummaryUpdate = (event) => {
		console.log(event.target.value);
		this.setState({
			summary: event.target.value
		});
	};

	render() {
		const { classes } = this.props;
		const { summary, files } = this.state;
		return (
			<React.Fragment>
				<ClaimHeader title="Create New Claim" buttons={this.headerButtons} />
				<Grid container className={classes.container}>
					<SummaryField
						value={summary}
						handleUpdate={this.handleSummaryUpdate}
					/>
					<FileUpload onUpload={this.handleFileUpload} files={files} />
				</Grid>
			</React.Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ClaimNew);
