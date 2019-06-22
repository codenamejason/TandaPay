import React from "react";
import PageHeader from "../../../../components/PageHeader";
import { Grid, Card, withStyles } from "@material-ui/core";
import styles from "./basic.style";
const headerText = "My Profile";
const headerButtons = [
    {
        text: "ADVANCED SETTINGS",
        type: "blue",
        url: "/admin/profile/advanced",
    },
];
const BasicSettings = props => {
    const { classes } = props;
    return (
        <div>
            <PageHeader title={headerText} buttons={headerButtons} />
            <Grid container className={classes.container}>
                <Grid item xs={12} sm={6} className={classes.cardContainer}>
                    <Card className={classes.overview}>
                        <h1>User Overview</h1>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.cardContainer}>
                    <Card className={classes.basic}>
                        <h1>Change Basic Settings</h1>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(styles, { withTheme: true })(BasicSettings);
