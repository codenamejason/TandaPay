import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../../../actions";

export const withGroup = WrappedComponent => {
    let HasGroupComponent = props => {
        let { user, group } = props;

        if (user.groupID) {
            if (group == null) {
                return <GroupLoader />
            }

            return <WrappedComponent {...props} />;
        } else {
            return <Redirect to="/admin/groups/new" />;
        }
    };

    return connect(state => state)(HasGroupComponent);
};

export const withoutGroup = WrappedComponent => {
    let GrouplessComponent = props => {
        let { user } = props;

        if (!user.groupID) {
            return <WrappedComponent {...props} />;
        } else {
            return <Redirect to="/admin/groups" />;
        }
    };

    return connect(state => state)(GrouplessComponent);
};

const GroupLoader = connect(
    null,
    actions
)(props => {
    props.fetchGroup();
    return <span>Loading...</span>;
});
