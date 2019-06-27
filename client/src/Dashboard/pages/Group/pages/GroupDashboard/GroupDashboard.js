import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { Myself, Subgroup, Members } from "./components";
import PageHeader from "../../../../components/PageHeader";
import * as actions from "../../../../../actions";

const GroupDashboard = connect(
    mapStateToProps,
    actions
)(props => {
    let { group } = props;

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
            <Myself />
            <Subgroup />
            <Members />
        </React.Fragment>
    );
});

function mapStateToProps({ group }) {
    return { group };
}

export default GroupDashboard;
