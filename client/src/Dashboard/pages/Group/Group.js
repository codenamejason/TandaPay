import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageHeader from "../../components/PageHeader";
import { GroupCreator, Me, Members, Subgroup } from "./components";
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
            <PageHeader title={group.groupName + " Members"} />
            <Me />
            <Subgroup />
            <Members />
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

function mapStateToProps({ group }) {
    return { group };
}

const GroupRouting = () => (
    <Wrapper>
        <Switch>
            <Route exact path="/admin/groups" component={Group} />
            <Route exact path="/admin/groups/new" component={GroupCreator} />
        </Switch>
    </Wrapper>
);

export default GroupRouting;
