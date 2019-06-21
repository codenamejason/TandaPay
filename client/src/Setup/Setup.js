import React from "react";
import { CssBaseline, Grid, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../actions";
import { WalletPage, RolePage, GroupPage } from "./pages";
import styles from "./setup.style";

class Setup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			role: "",
			accessCode: "",
			walletProvider: "",
			ethAddress: "",
			page: 0,
		};
	}
	onRoleSubmit = (role, accessCode) => {
		this.setState({
			role,
			accessCode,
			page: 1,
		});
	};

	onWalletSubmit = async (walletProvider, ethAddress) => {
		this.setState({
			walletProvider,
			ethAddress,
		});
		const { role, accessCode } = this.state;
		//call action creator

		if (role === "secretary") {
			this.setState({
				page: 2,
			});
		} else {
			this.props.completeAccount({
				role,
				accessCode,
				walletProvider,
				ethAddress,
			});
		}
	};

	onGroupSubmit = async (name, premium) => {
		let { role, accessCode, walletProvider, ethAddress } = this.state;
		await this.props.completeAccount({
			role,
			accessCode,
			walletProvider,
			ethAddress,
		});
		await this.props.createGroup({ name, premium });
	};

	handlePrevious = () => {
		const { page } = this.state;
		if (page === 0) {
			//cancel user
			this.props.cancelAccount();
		} else {
			this.setState({
				page: page - 1,
			});
		}
	};
	render() {
		const { classes } = this.props;
		const { page, role, accessCode } = this.state;
		return (
			<Grid container component="main" className={classes.root}>
				<CssBaseline />
				{page === 0 && (
					<RolePage
						onPageSubmit={this.onRoleSubmit}
						previousPage={this.handlePrevious}
						role={role}
						accessCode={accessCode}
					/>
				)}
				{page === 1 && (
					<WalletPage
						onPageSubmit={this.onWalletSubmit}
						previousPage={this.handlePrevious}
					/>
				)}
				{page === 2 && (
					<GroupPage
						onPageSubmit={this.onGroupSubmit}
						previousPage={this.handlePrevious}
					/>
				)}
			</Grid>
		);
	}
}
export default connect(
	null,
	actions
)(withStyles(styles, { withTheme: true })(Setup));
