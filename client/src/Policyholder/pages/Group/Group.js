import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";

import { GroupCreator, GroupDashboard, InviteMember } from "./pages";
import { withGroup, withoutGroup } from "./components/HOCs.js";
import SubgroupMembers from "./pages/SubgroupMembers/SubgroupMembers";
import styles from "./group.style.js";

const Wrapper = withStyles(styles, { withTheme: true })(
  ({ children, classes }) => {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    );
  }
);

const Group = () => (
  <Wrapper>
    <Switch>
      <Route
        exact
        path="/holder/groups"
        component={withGroup(GroupDashboard)}
      />
      <Route
        exact
        path="/holder/groups/subgroup/:id"
        component={withGroup(SubgroupMembers)}
      />{" "}
      <Route
        exact
        path="/holder/groups/new"
        component={withoutGroup(GroupCreator)}
      />
      <Route
        exact
        path="/holder/groups/invite"
        component={withGroup(InviteMember)}
      />
    </Switch>
  </Wrapper>
);

export default Group;
