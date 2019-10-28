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

class SubgroupMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: "" };
  }

  handleFilterChange = evt => {
    this.setState({ filter: evt.target.value });
  };

  componentWillMount() {
    const { match, group } = this.props;

    const subgroupId = match.params.id;

    let subMembers;
    let subName;
    for (var x in group.subgroups) {
      if (group.subgroups[x]._id === subgroupId) {
        subMembers = group.subgroups[x].members;
        subName = group.subgroups[x].name;
      }
    }
    this.setState({ subMembers, subName });
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
  <Card>
    <CardActionArea>
      <CardMedia
        className={classes.media}
        image="https://via.placeholder.com/150"
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {userData.name}
        </Typography>

        <Typography></Typography>
      </CardContent>
    </CardActionArea>
    <CardActions></CardActions>
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
