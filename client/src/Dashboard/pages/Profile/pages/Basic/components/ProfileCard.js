import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Grid, Card, Typography, withStyles } from "@material-ui/core";
import Avatar from "react-avatar";
import styles from "./profile.style";
const ProfileCard = props => {
  const { classes } = props;
  const user = useSelector(state => state.user);
  const { name, subgroup, standing = "", picture, email } = user;
  return (
    <Grid item xs={12} sm={6} className={classes.cardContainer}>
      <Grid container component={Card} className={classes.overview}>
        <Grid item xs={12} sm={6} className={classes.gridItem}>
          <div className={classes.profileContainer}>
            <div>
              <Typography variant="h4">{name}</Typography>
              <Typography variant="caption">{email}</Typography>
            </div>
            <div>
              {/* <Typography variant="body1" className={classes.subgroup}>
                {subgroup ? subgroup.toUpperCase() : "NO SUBGROUP JOINED"}
              </Typography> */}
              <Typography variant="body1" className={classes.standing}>
                {standing.toUpperCase()} STANDING
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          className={clsx(classes.center, classes.gridItem)}
        >
          <div className={classes.imageContainer}>
            {/* <img
              src={picture}
              alt="The provided user profile"
              className={classes.img}
            /> */}
            <Avatar name={name} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { withTheme: true })(ProfileCard);
