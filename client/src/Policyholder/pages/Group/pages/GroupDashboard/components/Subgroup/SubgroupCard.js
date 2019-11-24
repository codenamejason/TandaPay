import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography, Card, Button, Grid, TextField } from "@material-ui/core";
import * as actions from "../../../../../../../actions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import styles from "./SubgroupCard.style";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
class SubgroupCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filter: "" };
  }

  handleFilterChange = evt => {
    this.setState({ filter: evt.target.value });
  };

  render() {
    let { group, classes } = this.props;
    let { filter } = this.state;
    let filterExp = RegExp(filter, "i");

    return (
      <div id="members">
        <div className={classes.spaceBetween}>
          {/* <Typography style={{ alignSelf: "flex-end" }} variant="h4">
            All Members
          </Typography> */}
          <TextField
            label="Filter"
            type="search"
            margin="normal"
            value={this.state.filter}
            onChange={this.handleFilterChange}
          />
        </div>
        <Grid container>
          {group.subgroups
            .filter(m => filterExp.test(m.name))
            .map(m => (
              <Grid key={m.name} item sm={3}>
                <SubCard subgroup={m} classes={classes} />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

const SubCard = ({ classes, subgroup }) => (
  <Card className={classes.card}>
    <CardActionArea>
      {/* <CardMedia
        className={classes.media}
        image="https://material-ui.com/static/images/cards/paella.jpg"
        title="Contemplative Reptile"
      /> */}
      <Typography className={classes.theImage}>
        <Avatar name={subgroup.name} round={true} />
      </Typography>

      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {subgroup.name}
        </Typography>
        <b>{subgroup.members.length} </b>member(s)
        <Typography></Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button
        size="small"
        color="primary"
        to={`/holder/groups/subgroup/${subgroup._id}`}
        component={RegLink}
      >
        View Members
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
export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(SubgroupCard));
