import React from "react";
import { Typography } from "@material-ui/core/";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as actions from "../../../../actions/index";
import styles from "../claims.style";
import { RecentClaims, ClaimHeader, ClaimTable } from "../components/";

class Claims extends React.Component {
	constructor(props) {
		super(props);
		this.props.fetchClaims();
	}
	render() {
		const { user, claims } = this.props;
		const headerText =
			user.role === "secretary" ? "Recent Claims" : "My Claims";
		const headerButtons = [
			{ text: "NEW CLAIM", type: "green", url: "admin/claims/new" }
		];
		const topClaims = this.getTopClaims();
		return (
			<React.Fragment>
				<ClaimHeader title="(Group Name) Claims" buttons={headerButtons} />
				<Typography variant="h4">{headerText}</Typography>
				<RecentClaims claims={topClaims} />

				<Typography variant="h4">All Claims</Typography>
				<div>
					<ClaimTable claims={claims} />
				</div>
			</React.Fragment>
		);
	}

	/**
	 * @summary it will sort the group claims by the date created, and then if the user is a secretary show the top 4 most recent claims.
	 * Or if the user is a policyholder then it will show their top 4 most recent claims(instead of the group's most recent)
	 */
	getTopClaims = () => {
		const { claims, user } = this.props;
		//sorts by whichever one is the most recent
		const sortedClaims = claims.sort(
			(a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
		);

		//filter by the user's id if they're a policyholder
		if (user.role === "policyholder") {
			const userTop = sortedClaims
				.filter((claim) => claim.creatorID === user.sub)
				.splice(0, 4);
			return userTop;
		} else {
			const sortedTop = sortedClaims.slice(0, 4);
			return sortedTop;
		}
	};
}
function mapStateToProps({ claims, user }) {
	return { claims, user };
}
export default connect(
	mapStateToProps,
	actions
)(withStyles(styles, { withTheme: true })(Claims));
