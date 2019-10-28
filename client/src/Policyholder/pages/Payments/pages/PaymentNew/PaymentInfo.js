import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "./payment.style";
import { getDAIBalance, calculatePayment } from "../../../../../web3";
class PaymentInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      working: false,
      balance: 0,
      premium: "N/A"
    };
  }
  async componentDidMount() {
    try {
      console.log(this.props);

      const [balance, error] = await getDAIBalance(
        this.props.ethereum.web3,
        this.props.ethereum.DAI
      );

      if (!error) {
        this.setState({
          balance
        });
      }

      const [premiumPayment, err] = await calculatePayment(
        this.props.ethereum.web3,
        this.props.ethereum.TGP
      );
      console.log(premiumPayment, err);

      if (!err) {
        this.setState({
          premium: premiumPayment
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      working: true
    });

    this.props.onSignUpFormSubmit(this.props.ethereum.web3);
  }

  render() {
    const { classes } = this.props;
    const { balance, premium, working } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4">
                Balance
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6">
                ${balance} DAI
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2">
            Total balance of DAI in your wallet
          </Typography>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Subgroup
          </Typography>
          <div>
            <Chip className={classes.chip} label="Dumo Lab" />
          </div>
        </div>

        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Premium
          </Typography>
          <div>
            <Chip className={classes.chip} label={premium} />
          </div>
        </div>

        <div className={classes.section3}>
          <Button
            variant="contained"
            disabled={working}
            color="secondary"
            onClick={this.handleSubmit.bind(this)}
          >
            Pay Premium
          </Button>
          &nbsp;
          <Button
            variant="contained"
            disabled={working}
            color="secondary"
            type="submit"
          >
            Approve Premium
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ ethereum, group, user }) {
  return { ethereum, group, user };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(PaymentInfo)
);
