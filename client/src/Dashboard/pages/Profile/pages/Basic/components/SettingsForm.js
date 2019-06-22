import React from "react";
import { Grid, Card, withStyles } from "@material-ui/core";
import styles from "./form.style";

const SettingsForm = props => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
            <Card className={classes.basic}>
                <h1>Change Basic Settings</h1>
            </Card>
        </Grid>
    );
};

export default withStyles(styles, { withTheme: true })(SettingsForm);
