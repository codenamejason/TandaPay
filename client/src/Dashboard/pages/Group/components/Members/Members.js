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
} from "@material-ui/core";

import styles from "./Members.style.js";
import * as actions from "../../../../../actions";

const Members = ({ group, classes }) => (
    <div id="members">
        <Typography variant="h4">All Members</Typography>
        <Paper>
            <Table>
                <TableBody>
                    {group.members.map(member => (
                        <TableRow key={member.id} style={{ fontSize: 14 }}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>
                                <StandingLabel
                                    standing="good"
                                    classes={classes}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </div>
);

const StandingLabel = ({ standing, classes }) => (
    <span className={classes.standing + " " + classes[standing]}>
        {standing.substr(0, 1).toUpperCase() + standing.substr(1)}
    </span>
);

function mapStateToProps({ group }) {
    return { group };
}

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(Members));
