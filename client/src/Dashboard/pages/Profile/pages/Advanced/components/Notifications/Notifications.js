import React from "react";
import { Grid, Card, Typography, withStyles } from "@material-ui/core";

import styles from "./notifications.style";
const Notifications = props => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={7} className={classes.container}>
            <Card className={classes.card}>
                <Typography variant="h6">NOTIFICATION SETTINGS</Typography>
            </Card>
        </Grid>
    );
};

export default withStyles(styles, { withTheme: true })(Notifications);
