import React from "react";
import { Grid } from "@material-ui/core";
import StatCard from "./StatCard";
import useStyles from "./stats.style";
const stats = [
  {
    title: "Wallet Funds",
    type: "wallet",
    amount: "675.00"
  },
  {
    title: "Upcoming Payment",
    type: "payment",
    amount: "125.00"
  },
  {
    title: "Group Claims",
    type: "claims",
    amount: "8.00"
  }
];
const UserStats = props => {
  const classes = useStyles(props);
  return (
    <Grid container className={classes.container} spacing={6}>
      {stats.map((stat, index) => {
        return <StatCard stat={stat} key={index} />;
      })}
    </Grid>
  );
};

export default UserStats;
