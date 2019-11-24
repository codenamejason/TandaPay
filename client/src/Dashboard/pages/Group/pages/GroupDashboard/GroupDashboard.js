import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Loader from "../../../../../components/Loader";
import { Myself, Subgroup, Members, FinalizeGroupCreation } from "./components";
import { PageHeader } from "../../../../components/";
import * as actions from "../../../../../actions";

const GroupDashboard = connect(
  mapStateToProps,
  actions
)(props => {
  let { group } = props;

  if (!group) {
    props.fetchGroup();

    return (
      <React.Fragment>
        <Loader />
      </React.Fragment>
    );
  }

  if (group.contract !== undefined && group.contract !== "") {
    return (
      <React.Fragment>
        <PageHeader
          title={group.groupName + " Members"}
          buttons={[
            {
              text: "Invite Member",
              role: "secretary",
              type: "green",
              url: "/admin/groups/invite"
            },
            {
              text: "Manage Group",
              role: "secretary",
              type: "red",
              url: "/admin/groups/manage"
            }
          ]}
        />
        <Myself />
        <Subgroup />
        <Members />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <FinalizeGroupCreation />
      </React.Fragment>
    );
  }
});

function mapStateToProps({ group }) {
  return { group };
}

export default GroupDashboard;
