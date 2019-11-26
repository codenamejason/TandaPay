import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import {
  Typography,
  Card,
  Button,
  Grid,
  TextField,
  Divider
} from "@material-ui/core";

import styles from "./Members.style.js";
import * as actions from "../../../../../../../actions";

class Members extends React.Component {
  constructor(props) {
    super(props);

    let membersArray = [];
    let members = props.group.members;

    members.forEach(function(groupMemberElem, groupMemberIndex) {
      let name = groupMemberElem.name;
      let id = groupMemberElem.id;
      let standing = groupMemberElem.standing;
      let subgroup = "Unassigned";

      props.group.subgroups.forEach(function(subgroupElem, subgroupIndex) {
        let subgroupNameByIndex = subgroupElem.name;
        subgroupElem.members.forEach(function(
          subgroupMemberElem,
          subgroupMemberIndex
        ) {
          if (subgroupMemberElem.id.toString() == id) {
            subgroup = subgroupNameByIndex;
          }
        });
      });

      let memberObject = {
        name: name,
        id: id,
        standing: standing,
        subgroup: subgroup
      };

      membersArray.push(memberObject);
    });

    this.state = { filter: "", members: membersArray };
  }

  handleFilterChange = evt => {
    this.setState({ filter: evt.target.value });
  };

  render() {
    let { group, classes } = this.props;
    let { filter, members } = this.state;
    let filterExp = RegExp(filter, "i");

    return (
      <div id="members">
        <div className={classes.spaceBetween}>
          <Typography style={{ alignSelf: "flex-end" }} variant="h4">
            All Members
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
          {members
            .filter(m => filterExp.test(m.name))
            .map(m => (
              <Grid key={m.name} item sm={3}>
                <MemberCard member={m} classes={classes} />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

const StandingLabel = ({ standing, classes, style }) => (
  <span className={classes.standing + " " + classes[standing]} style={style}>
    {standing.substr(0, 1).toUpperCase() + standing.substr(1)}
  </span>
);

const MemberCard = ({ classes, member }) => (
  <Card className={classes.card}>
    <Typography className={classes.theImage}>
      <Avatar name={member.name} round={true} />
    </Typography>

    {/* <img
      src="https://via.placeholder.com/150"
      className={classes.img}
      alt="User Profile"
    /> */}
    <div className={classes.spaceBetween} style={{ padding: 10 }}>
      <div>
        <Typography variant="h6">{member.name}</Typography>
        Subgroup: {member.subgroup}
      </div>

      <Divider />
      <div className={classes.right}>
        <div>
          <StandingLabel classes={classes} standing="good" />
        </div>
      </div>
      <Button
        variant="contained"
        color="secondary"
        to={`/holder/groups/subgroup/user/${member.id}`}
        component={RegLink}
      >
        Details
      </Button>
    </div>
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
)(withStyles(styles, { withTheme: true })(Members));
