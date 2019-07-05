import React from "react";
import { withStyles, Card, Button, Typography } from "@material-ui/core/";
import styles from "./wallet.style";
import { PageHeader } from "../../components/";
import { WalletCard } from "./components/";

//consts
const headerText = "Wallet Balance";

const Wallet = props => {
    const { classes } = props;
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <PageHeader title={headerText} />
            <div className={classes.container}>
                <WalletCard />
            </div>
        </main>
    );
};

export default withStyles(styles, { withTheme: true })(Wallet);
