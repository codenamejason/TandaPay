import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  withStyles
} from "@material-ui/core";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  MonetizationOn as MoneyIcon
} from "@material-ui/icons";
import clsx from "clsx";
import styles from "./card.style";
import { getStats } from "./stats.utils";
class StatCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      extra: ""
    };
  }
  async componentDidMount() {
    const { stat, data } = this.props;
    const [amount, extra] = await getStats(stat.type, data);
    this.setState({
      amount,
      extra
    });
  }
  render() {
    const { stat, classes } = this.props;
    const { amount, extra } = this.state;
    return (
      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <StatIcon type={stat.type} classes={classes} />
            <Typography variant="body1">{stat.title}</Typography>
            <Typography
              variant="h5"
              className={clsx(classes.amountText, {
                [classes.moneyText]: stat.format === "$" && amount !== "N/A",
                [classes.infoText]: stat.format === "#" && amount !== "N/A"
              })}
            >
              {amount !== "N/A" && stat.format} {amount || "0"}
            </Typography>
          </CardContent>
          <CardActions>
            <Typography variant="caption">{extra || "LOADING INFO"}</Typography>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

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
export default withStyles(styles, { withTheme: true })(StatCard);
