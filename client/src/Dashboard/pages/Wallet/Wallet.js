import React from "react";
import { withStyles, Card, Button, Typography } from "@material-ui/core/";
import styles from "./wallet.style";
import { PageHeader } from "../../components/";
import { WalletCard } from "./components/";
import { Table as WalletTable } from "../../components";
import { headRows } from "./data";
//consts
const headerText = "Wallet Balance";

/**
 *
 * @param {Object} props
 * @todo add data generation for the scripts
 */
const Wallet = props => {
    const { classes } = props;
    const data = getTransferHistory();
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <PageHeader title={headerText} />
            <div className={classes.container}>
                <WalletCard />
                <WalletTable
                    data={data}
                    headRows={headRows}
                    title="Transfer History"
                    type="transfers"
                />
            </div>
        </main>
    );
};

/**
 *
 */
const getTransferHistory = () => {
    //axios call
    return [];
};

export default withStyles(styles, { withTheme: true })(Wallet);
