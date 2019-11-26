import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import styles from "./groupStats.style";
import Avatar from "react-avatar";
class GroupStats extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item>
              <ButtonBase className={classes.image}>
                {/* <img
                  className={classes.img}
                  alt="complex"
                  src="/static/images/grid/complex.jpg"
                /> */}

                <Avatar className={classes.img} name={this.props.name} />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    Total Payments
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.paid} User(s)
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">Total Defected</Typography>
                <Typography variant="h6" gutterBottom>
                  {this.props.defected} User(s)
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(GroupStats);
