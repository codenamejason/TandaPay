import React from "react";
import {
	Grid,
	Typography,
	Button,
	withStyles,
	Card,
	CardContent,
	CircularProgress
} from "@material-ui/core";
import clsx from "clsx";
import styles from "./wallet.style";
import ButtonGroup from "../components/ButtonGroup/";
import MetamaskIcon from "../../../assets/metamask.svg";
import FortmaticIcon from "../../../assets/fortmatic.svg";
class WalletPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			walletProvider: "",
			ethAddress: "",
			metamaskLoading: false,
			fortmaticLoading: false
		};
	}
	render() {
		const { classes } = this.props;
		const { walletProvider, metamaskLoading, fortmaticLoading } = this.state;
		return (
			<div>
				<Grid container>
					<Grid item xs={12} sm={6} className={classes.area}>
						<Card className={classes.card}>
							<img
								src={MetamaskIcon}
								className={classes.img}
								alt="Metamask"
								title="Metamask"
								aria-label="Metamask"
							/>

							<CardContent className={classes.cardContent}>
								<Typography variant="h6" className={classes.highlight}>
									Advanced Users
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onMetamaskClick}
									className={clsx(classes.connect, {
										[classes.connected]: walletProvider === "metamask"
									})}
								>
									{metamaskLoading === true && (
										<CircularProgress className={classes.loader} />
									)}
									{walletProvider === "metamask" && metamaskLoading === false
										? "Connected"
										: metamaskLoading === false && "Connect"}
								</Button>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} className={classes.area}>
						<Card className={classes.card}>
							<img
								src={FortmaticIcon}
								className={classes.img}
								alt="Fortmatic"
								title="Fortmatic"
								aria-label="Fortmatic"
							/>
							<CardContent className={classes.cardContent}>
								<Typography variant="h6" className={classes.highlight}>
									Recommended
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.onFormaticClick}
									className={clsx(classes.connect, {
										[classes.connected]: walletProvider === "fortmatic"
									})}
								>
									{fortmaticLoading === true && (
										<CircularProgress className={classes.loader} />
									)}
									{walletProvider === "fortmatic" && fortmaticLoading === false
										? "Connected"
										: fortmaticLoading === false && "Connect"}
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<ButtonGroup
					handleNext={this.handleNext}
					handlePrevious={this.props.previousPage}
					page={1}
				/>
			</div>
		);
	}

	onMetamaskClick = async () => {
		const walletProvider = "metamask";
		const ethAddress = "0xasifojasiofdj";
		this.setState({
			walletProvider,
			metamaskLoading: true,
			fortmaticLoading: false
		});
		//enable metamask
		await sleep(2000);
		this.setState({
			ethAddress,
			metamaskLoading: false
		});
	};

	onFormaticClick = async () => {
		const walletProvider = "fortmatic";
		const ethAddress = "0xasifojasiofdj";
		this.setState({
			walletProvider,
			fortmaticLoading: true,
			metamaskLoading: false
		});
		//enable fortmatic
		await sleep(2000);
		this.setState({
			ethAddress,
			fortmaticLoading: false
		});
	};
}
const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export default withStyles(styles, { withTheme: true })(WalletPage);
