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
import { getStats } from "./stats.utils";
const StatCard = props => {
  const { stat, data } = props;
  const classes = useStyles(props);
  const [amount, extra] = getStats(stat.type, data);
  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <StatIcon type={stat.type} classes={classes} />
          <Typography variant="body1">{stat.title}</Typography>
          <Typography
            variant="h5"
            className={clsx(classes.amountText, {
              [classes.moneyText]: stat.format === "$",
              [classes.infoText]: stat.format === "#"
            })}
          >
            {stat.format} {amount || "0"}
          </Typography>
        </CardContent>
        <CardActions>
          <Typography variant="caption">{extra || "LOADING INFO"}</Typography>
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
