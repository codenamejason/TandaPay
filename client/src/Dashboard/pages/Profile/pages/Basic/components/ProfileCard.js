import React from "react";
import { Grid, Card, Typography, withStyles } from "@material-ui/core";

import styles from "./profile.style";
const ProfileCard = props => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
            <Grid container component={Card} className={classes.overview}>
                <Grid item xs={12} sm={6}>
                    <div className={classes.profileContainer}>
                        <div>
                            <Typography variant="h4">Jane Doe</Typography>
                            <Typography variant="caption">
                                04/02/2019
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="body1"
                                className={classes.subgroup}
                            >
                                SUBGROUP
                            </Typography>
                            <Typography
                                variant="body1"
                                className={classes.standing}
                            >
                                GOOD STANDING
                            </Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.center}>
                    <div>
                        <h1>Image</h1>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles, { withTheme: true })(ProfileCard);
