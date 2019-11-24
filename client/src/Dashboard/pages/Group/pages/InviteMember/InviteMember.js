import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./InviteMember.style.js";
import { PageHeader } from "../../../../components";
import InviteForm from "./InviteForm";

class InviteMember extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          title="Invite Member"
          buttons={[
            {
              text: "Cancel",
              type: "red",
              url: "/admin/groups"
            }
          ]}
        />
        <div className={classes.form}>
          <InviteForm />
        </div>
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

export default connect(null)(
  withStyles(styles, { withTheme: true })(secretaryOnly(InviteMember))
);
