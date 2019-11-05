import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Button,
  Grid,
  TextField,
  Divider,
  Chip
} from "@material-ui/core";
import { Link } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import WyreModal from "../../../components/WyreModal/WyreModal";
import CardActions from "@material-ui/core/CardActions";
import styles from "./finalizeBuy.style";

class FinalizeBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stateAddress: "0x0", stateAmount: 0, stateId: null };
  }

  componentWillMount() {
    const { match, group } = this.props;

    const amount = match.params.amount;
    const address = match.params.address;
    const id = match.params.id;
    this.setState({
      stateAddress: address,
      stateAmount: amount,
      stateId: id
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item>
              <Typography gutterBottom variant="h6">
                Wyre
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2">
            Make sure to have enough fund before buying
          </Typography>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Amount
          </Typography>
          <div>
            <Chip className={classes.chip} label={this.state.stateAmount} />
          </div>
        </div>

        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Address
          </Typography>
          <div>
            <Chip className={classes.chip} label={this.state.stateAddress} />
          </div>
        </div>

        <div className={classes.section3}>
          <WyreModal
            amount={this.state.stateAmount}
            address={this.state.stateAddress}
            id={this.state.stateId}
          />
          &nbsp;
        </div>
      </div>
    );
  }
}

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function mapStateToProps({ group }) {
  return { group };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FinalizeBuy))
);
