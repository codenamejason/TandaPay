import React from "react";
import { Grid, withStyles } from "@material-ui/core";
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
		const { walletProvider, metamaskLoading, fortmaticLoading } = this.state;
		return (
			<div>
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
