import React from "react";
import { Grid, withStyles, Typography } from "@material-ui/core";
import styles from "./wallet.style";
import ButtonGroup from "../components/ButtonGroup/";
import MetamaskIcon from "../../../assets/metamask.svg";
import FortmaticIcon from "../../../assets/fortmatic.svg";
import WalletCard from "./components/WalletCard";
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
		const {
			walletProvider,
			metamaskLoading,
			fortmaticLoading,
			ethAddress
		} = this.state;
		const formCompleted = walletProvider && ethAddress;
		return (
			<div>
				<Typography variant="h3" className={classes.title}>
					What will your wallet provider be?
				</Typography>
				<Grid container>
					<WalletCard
						type="metamask"
						handleClick={this.onMetamaskClick}
						IconSrc={MetamaskIcon}
						loading={metamaskLoading}
						selected={walletProvider}
					/>
					<WalletCard
						type="fortmatic"
						handleClick={this.onFormaticClick}
						IconSrc={FortmaticIcon}
						loading={fortmaticLoading}
						selected={walletProvider}
					/>
				</Grid>
				<ButtonGroup
					handleNext={this.handleNext}
					handlePrevious={this.props.previousPage}
					page={1}
					disabled={!formCompleted}
				/>
			</div>
		);
	}
	handleNext = () => {
		const { walletProvider, ethAddress } = this.state;
		this.props.onPageSubmit(walletProvider, ethAddress);
	};
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
