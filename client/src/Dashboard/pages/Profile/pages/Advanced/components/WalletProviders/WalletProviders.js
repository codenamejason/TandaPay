import React from "react";
import { Grid, Typography, Card } from "@material-ui/core";
import styles from "./wallet.style";
import { withStyles } from "@material-ui/styles";
const WalletProvider = props => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={5} className={classes.container}>
            <Card className={classes.card}>
                <Typography variant="h6">Wallet Providers</Typography>
            </Card>
        </Grid>
    );
};

export default withStyles(styles, { withTheme: true })(WalletProvider);
