import React from "react";
import {
	Grid,
	Typography,
	Button,
	withStyles,
	Card,
	CardContent
} from "@material-ui/core";
import styles from "../setup.style";
class WalletPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			walletProvider: "",
			ethAddress: ""
		};
	}
	render() {
		const { classes } = this.props;
		return (
			<div>
				<Grid container>
					<Grid item xs={6} className={classes.area}>
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Typography variant="h4" className={classes.subtitle}>
									Metamask
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onMetamaskClick}
								>
									Connect
								</Button>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={6} className={classes.area}>
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Typography variant="h4" className={classes.subtitle}>
									Fortmatic
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onFormaticClick}
								>
									Connect
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				{this.renderFormButtons()}
			</div>
		);
	}

	onMetamaskClick = () => {
		const walletProvider = "metamask";
		const ethAddress = "0xasifojasiofdj";
		this.setState({
			walletProvider,
			ethAddress
		});
		//set the info
	};

	onFormaticClick = () => {
		const walletProvider = "fortmatic";
		const ethAddress = "0xoasjofj02j0";
		this.setState({
			walletProvider,
			ethAddress
		});
	};
	renderFormButtons = () => {
		const { classes } = this.props;
		const { walletProvider, ethAddress } = this.state;
		return (
			<Grid container className={classes.buttonGroup}>
				<Grid item xs={6} className={classes.cancelButton}>
					<Button
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={this.props.previousPage}
					>
						Previous
					</Button>
				</Grid>
				<Grid item xs={6} className={classes.nextButton}>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={() => this.props.onPageSubmit(walletProvider, ethAddress)}
					>
						SAVE
					</Button>
				</Grid>
			</Grid>
		);
	};
}

export default withStyles(styles, { withTheme: true })(WalletPage);
