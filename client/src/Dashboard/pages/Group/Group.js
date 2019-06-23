import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Button,
    Grid,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as actions from "../../../actions";
import PageHeader from "../../components/PageHeader";
import GroupCreator from "./components/GroupCreator/GroupCreator";
import styles from "./group.style.js";

const Group = props => {
    let { group, classes } = props;

    if (!group) {
        props.fetchGroup();
        return <Wrapper classes={classes}>Loading...</Wrapper>;
    }

    if (group.mustBeCreated) {
        return (
            <Wrapper classes={classes}>
                <GroupCreator createGroup={props.createGroup} />
            </Wrapper>
        );
    }

    return (
        <Wrapper classes={classes}>
            <PageHeader title={group.groupName + " Information"} />
            <Typography variant="h4">Members</Typography>
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
        </Wrapper>
    );
};

const Wrapper = ({ children, classes }) => {
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
        </main>
    );
};

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
)(withStyles(styles, { withTheme: true })(Group));
