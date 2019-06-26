import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageHeader from "../../components/PageHeader";
import GroupCreator from "./components/GroupCreator/GroupCreator";
import styles from "./group.style.js";
import * as actions from "../../../actions";

const styler = withStyles(styles, { withTheme: true });
const connectAndStyle = component =>
    connect(
        mapStateToProps,
        actions
    )(styler(component));

const Group = connectAndStyle(props => {
    let { group, classes } = props;

    if (!group) {
        props.fetchGroup();
        return "Loading...";
    }

    if (group.mustBeCreated) {
        return <Redirect to="/admin/groups/new" />;
    }

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
});

const Wrapper = styler(({ children, classes }) => {
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
        </main>
    );
});

const StandingLabel = ({ standing, classes }) => (
    <span className={classes.standing + " " + classes[standing]}>
        {standing.substr(0, 1).toUpperCase() + standing.substr(1)}
    </span>
);

function mapStateToProps({ group }) {
    return { group };
}

export default () => (
    <Wrapper>
        <Switch>
            <Route exact path="/admin/groups" component={Group} />
            <Route exact path="/admin/groups/new" component={GroupCreator} />
        </Switch>
    </Wrapper>
);
