import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as actions from "../../../actions";
import PageHeader from "../../components/PageHeader";
import { GroupCreator, Me, Members, Subgroup } from "./components";
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
            <PageHeader title={group.groupName + " Members"} />
            <Me />
            <Subgroup />
            <Members />
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

function mapStateToProps({ group }) {
    return { group };
}

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(Group));
