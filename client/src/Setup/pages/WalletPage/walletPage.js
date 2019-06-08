import React from "react";
import {
	Grid,
	Typography,
	Button,
	withStyles,
	Card,
	CardContent,
	CardMedia
} from "@material-ui/core";
import clsx from "clsx";
import styles from "./wallet.style";
import MetamaskIcon from "../../../assets/metamask.svg";
import FortmaticIcon from "../../../assets/fortmatic.svg";
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
					<Grid item xs={12} sm={6} className={classes.area}>
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								<CardMedia
									src={MetamaskIcon}
									component="img"
									className={classes.img}
									title="Metamask"
								/>
								<Typography variant="h6" className={classes.highlight}>
									Advanced Users
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onMetamaskClick}
									className={classes.connect}
								>
									Connect
								</Button>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} className={classes.area}>
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								<CardMedia
									src={FortmaticIcon}
									component="img"
									title="Fortmatic"
									className={classes.img}
								/>
								<Typography variant="h6" className={classes.highlight}>
									Recommended
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onFormaticClick}
									className={classes.connect}
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
						className={clsx(classes.button, classes.cancel)}
						onClick={this.props.previousPage}
					>
						Previous
					</Button>
				</Grid>
				<Grid item xs={6} className={classes.nextButton}>
					<Button
						variant="contained"
						color="primary"
						className={clsx(classes.button, classes.next)}
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
