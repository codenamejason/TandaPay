import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import styles from "../../../../../../../Policyholder/pages/Payments/pages/PaymentNew/payment.style";
import { getDAIBalance } from "../../../../../../../web3";
class StartGroupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      working: false,
      groupName: "N/A",

      members: "0",
      subgroups: "0"
    };
  }
  async componentDidMount() {
    try {
      console.log(this.props);
      const { groupName, members, subgroups } = this.props.group;
      this.setState({
        groupName,
        members: members.length,
        subgroups: subgroups.length
      });
    } catch (e) {
      console.log(e);
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      working: true
    });

    this.props.onStartGroup(this.props.ethereum.web3);
  }

  render() {
    const { classes } = this.props;
    const { groupName, working, members, subgroups } = this.state;

    return (
      <div className={classes.root2}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4">
                {groupName} group
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2">
            This group must have at least 50 members before you can start the
            group.
          </Typography>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Total Members &nbsp;{" "}
            <Chip className={classes.chip} label={members} />
          </Typography>
        </div>

        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Total subgroups &nbsp;{" "}
            <Chip className={classes.chip} label={subgroups} />
          </Typography>
        </div>

        <div className={classes.section3}>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <Button
              variant="contained"
              disabled={working}
              color="secondary"
              type="submit"
            >
              Start Group
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ ethereum, group, user }) {
  return { ethereum, group, user };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(StartGroupForm)
);
