import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Typography,
    Card,
    Button,
    Grid,
} from "@material-ui/core";

import styles from "./Members.style.js";
import * as actions from "../../../../../actions";

const Members = ({ group, classes }) => (
    <div id="members">
        <Typography variant="h4">All Members</Typography>
        <Grid container>
            {group.members.map(m => (
                <Grid key={m.name} item sm="3">
                    <MemberCard member={m} classes={classes} />
                </Grid>
            ))}
        </Grid>
    </div>
);

const StandingLabel = ({ standing, classes, style }) => (
    <span className={classes.standing + " " + classes[standing]} style={style}>
        {standing.substr(0, 1).toUpperCase() + standing.substr(1)}
    </span>
);

const MemberCard = ({ classes, member }) => (
    <Card className={classes.card}>
        <img
            src="https://via.placeholder.com/150"
            className={classes.img}
            alt="User Profile"
        />
        <div className={classes.container}>
            <div>
                <Typography>{member.name}</Typography>
                <Typography>Subgroup</Typography>
            </div>
            <div className={classes.right}>
                <div>
                    <StandingLabel classes={classes} standing="good" />
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                >
                    Details
                </Button>
            </div>
        </div>
    </Card>
);

function mapStateToProps({ group }) {
    return { group };
}

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(Members));
