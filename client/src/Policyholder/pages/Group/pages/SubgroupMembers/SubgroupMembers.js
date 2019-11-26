import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography, Card, Button, Grid, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import styles from "./subgroupMembers.style";
import Avatar from "react-avatar";
import GroupStats from "../../../../../components/GroupStats/GroupStats";
import {
  getActivePeriod,
  getPaidParticipantAmount,
  getDefectionCount
} from "../../../../../web3";
class SubgroupMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: "", paymentCount: 0, defCount: 0 };
  }

  handleFilterChange = evt => {
    this.setState({ filter: evt.target.value });
  };
  async componentDidMount() {
    try {
      const { groupName, members, subgroups } = this.props.group;
      const [period, error] = await getActivePeriod(
        this.props.ethereum.web3,
        this.props.group.contract
      );

      if (!error) {
        try {
          const [rs_status, error] = await getPaidParticipantAmount(
            this.props.ethereum.web3,
            this.props.group.contract,
            period,
            this.state.subIdex + 1
          );

          if (rs_status) {
            this.setState({
              paymentCount: rs_status._subgroupParticipantAmount
            });
          }
        } catch (e) {}

        try {
          const [def, error] = await getDefectionCount(
            this.props.ethereum.web3,
            this.props.group.contract,
            period,
            this.state.subIdex + 1
          );

          if (def) {
            this.setState({
              defCount: def
            });
          }
        } catch (e) {}
      }
    } catch (e) {
      console.log(e);
    }
  }
  componentWillMount() {
    const { match, group } = this.props;

    const subgroupId = match.params.id;

    let subMembers;
    let subName;
    let subIdex;
    for (var x in group.subgroups) {
      if (group.subgroups[x]._id === subgroupId) {
        subMembers = group.subgroups[x].members;
        subName = group.subgroups[x].name;
        subIdex = x;
        break;
      }
    }
    this.setState({ subMembers, subName, subIdex });
  }
  render() {
    const { subMembers, subName } = this.state;
    const { classes } = this.props;
    let { filter } = this.state;
    let filterExp = RegExp(filter, "i");
    return (
      <div id="members">
        <div className={classes.spaceBetween}>
          <Typography style={{ alignSelf: "flex-end" }} variant="h4">
            {subName} Member(s)
          </Typography>
          <GroupStats
            defected={this.state.defCount}
            name={subName}
            paid={this.state.paymentCount}
          />
          <TextField
            label="Filter"
            type="search"
            margin="normal"
            value={this.state.filter}
            onChange={this.handleFilterChange}
          />
        </div>
        <Grid container>
          {subMembers
            .filter(m => filterExp.test(m.name))
            .map(m => (
              <Grid key={m.name} item sm={3}>
                <SubCard userData={m} classes={classes} />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

const SubCard = ({ classes, userData }) => (
  <Card className={classes.card}>
    <CardActionArea>
      {/* <CardMedia
        className={classes.media}
        image="https://via.placeholder.com/150"
        title="Contemplative Reptile"
      /> */}
      <Typography className={classes.theImage}>
        <Avatar name={userData.name} round={true} />
      </Typography>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {userData.name}
        </Typography>

        <Typography></Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        to={`/holder/groups/subgroup/user/${userData.id}`}
        component={RegLink}
      >
        Details
      </Button>
    </CardActions>
  </Card>
);
const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function mapStateToProps({ group }) {
  return { group };
}

export default withRouter(
  connect(mapStateToProps)(
    withStyles(styles, { withTheme: true })(SubgroupMembers)
  )
);
