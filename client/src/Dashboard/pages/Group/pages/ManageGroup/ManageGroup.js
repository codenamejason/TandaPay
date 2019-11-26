import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PageHeader } from "../../../../components";
import ScrollableTabsButtonAuto from "./components/Tabs/ScrollableTabsButtonAuto";

class ManageGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          title="Manage Group"
          buttons={[
            {
              text: "Secretary Responsibilities",
              type: "green",
              url: "/admin/groups/secretary-responsibilities"
            },
            {
              text: "Back",
              type: "red",
              url: "/admin/groups"
            }
          ]}
        />
        <ScrollableTabsButtonAuto />
      </React.Fragment>
    );
  }
}

const secretaryOnly = Component => props =>
  props.user.role === "secretary" ? (
    <Component {...props} />
  ) : (
    <Redirect to="/admin/groups" />
  );

function mapStateToProps({ group }) {
  return { group };
}

export default connect(mapStateToProps)(secretaryOnly(ManageGroup));
