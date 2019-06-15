import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { ClaimHeader } from "../../components";
import * as actions from "../../../../../actions";
import styles from "./new.style.js";
import FileUpload from "./components/FileUpload";
import SummaryField from "./components/SummaryField";

class ClaimNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			summary: ""
		};
	}
	handleClaimSubmit = () => {
		const { files, summary } = this.state;
		this.props.createClaim(summary, files);
	};
	displayGuide = (guideURL) => {
		window.open(guideURL, "_blank");
	};

	handleFileUpload = (event) => {
		this.setState({
			files: event.target.files
		});
	};

	handleSummaryUpdate = (event) => {
		this.setState({
			summary: event.target.value
		});
	};

	render() {
		const headerButtons = [
			{ text: "VIEW GUIDE", type: "blue", handleClick: this.displayGuide },
			{ text: "CANCEL", type: "red", url: "/admin/claims" },
			{ text: "SUBMIT", type: "green", handleClick: this.handleClaimSubmit }
		];
		const { classes } = this.props;
		const { summary, files } = this.state;
		return (
			<React.Fragment>
				<ClaimHeader title="Create New Claim" buttons={headerButtons} />
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

export default connect(
	null,
	actions
)(withStyles(styles, { withTheme: true })(ClaimNew));
