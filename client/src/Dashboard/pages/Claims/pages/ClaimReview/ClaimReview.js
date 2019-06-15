import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, withStyles } from "@material-ui/core";
import * as actions from "../../../../../actions";
import { ClaimHeader } from "../../components";

import data from "../../../../../data/data.json";
import styles from "./review.style";
import ProfileCard from "./components/ProfileCard";
import ClaimDocs from "./components/ClaimDocs";
const claims = data.claims;
class ClaimReview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			claim: null
		};
	}
	componentWillMount() {
		const { match } = this.props;
		const claimID = match.params.id;
		let claim;
		for (var x in claims) {
			if (claims[x].objectID === claimID) {
				claim = claims[x];
			}
		}
		this.setState({
			claim
		});
	}
	render() {
		const { classes } = this.props;
		const { claim } = this.state;
		console.log(claim);
		const headerButtons = [
			{ text: "REJECT", type: "red" },
			{ text: "APPROVE", type: "green" }
		];
		return (
			<React.Fragment>
				<ClaimHeader title="Claim Overview" buttons={headerButtons} />
				<Grid container className={classes.topSection}>
					<ProfileCard claim={claim} />
					<Grid item xs={12} sm={6}>
						<Typography variant="h3">Summary</Typography>
						<Typography variant="body1">{claim.summary}</Typography>
					</Grid>
				</Grid>
				<ClaimDocs />
			</React.Fragment>
		);
	}
}

function mapStateToProps({ user }) {
	return { user };
}

export default connect(
	mapStateToProps,
	actions
)(withStyles(styles, { withTheme: true })(ClaimReview));
