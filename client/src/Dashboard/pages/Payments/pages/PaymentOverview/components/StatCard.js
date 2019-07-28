import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions
} from "@material-ui/core";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  MonetizationOn as MoneyIcon
} from "@material-ui/icons";
import clsx from "clsx";
import useStyles from "./stats.style";

const StatCard = props => {
  const { stat } = props;
  const classes = useStyles(props);

  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <StatIcon type={stat.type} classes={classes} />
          <Typography variant="body1">{stat.title}</Typography>
          <Typography variant="h5" className={classes.amountText}>
            $ {stat.amount}
          </Typography>
        </CardContent>
        <CardActions>
          <Typography variant="caption">EXTRA INFORMAITON</Typography>
        </CardActions>
      </Card>
    </Grid>
  );
};

const StatIcon = props => {
  const { type, classes } = props;
  switch (type) {
    case "wallet": {
      return (
        <div className={clsx(classes.iconWrapper, classes.wallet)}>
          <MoneyIcon className={classes.icon} />
        </div>
      );
    }
    case "payment": {
      return (
        <div className={clsx(classes.iconWrapper, classes.warning)}>
          <WarningIcon className={classes.icon} />
        </div>
      );
    }
    case "claims": {
      return (
        <div className={clsx(classes.iconWrapper, classes.info)}>
          <InfoIcon className={classes.icon} />
        </div>
      );
    }
    default:
      return null;
  }
};
export default StatCard;
