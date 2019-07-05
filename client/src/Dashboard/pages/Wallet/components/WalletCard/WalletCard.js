import React from "react";
import clsx from "clsx";
import { withStyles, Card, Typography, Button } from "@material-ui/core";
import styles from "./card.style";
const WalletCard = props => {
    const { classes } = props;
    return (
        <Card className={classes.walletCard}>
            <Typography variant="h6">DAI Stablecoin</Typography>
            <div className={classes.balance}>
                <Typography variant="body1">Balance</Typography>
                <Typography variant="body1">Balance Amount</Typography>
            </div>
            <div className={classes.buttonGroup}>
                <Button className={clsx(classes.button, [classes.red])}>
                    SELL
                </Button>
                <Button className={clsx(classes.button, [classes.yellow])}>
                    SEND
                </Button>
                <Button className={clsx(classes.button, [classes.green])}>
                    BUY
                </Button>
            </div>
        </Card>
    );
};

export default withStyles(styles, { withTheme: true })(WalletCard);
