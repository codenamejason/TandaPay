import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";

import { GroupCreator, GroupDashboard, InviteMember } from "./pages";
import ManageGroup from "./pages/ManageGroup/ManageGroup";
import SubgroupMembers from "./pages/SubgroupMembers/SubgroupMembers";
import ManageUser from "./pages/ManageUser/ManageUser";
import SecretaryGuide from "./pages/SecretaryGuide/SecretaryGuide";
import SubgroupGuide from "./pages/SubgroupGuide/SubgroupGuide";

import { withGroup, withoutGroup } from "./components/HOCs.js";
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
      <Route exact path="/admin/groups" component={withGroup(GroupDashboard)} />
      <Route
        exact
        path="/admin/groups/new"
        component={withoutGroup(GroupCreator)}
      />

      <Route
        exact
        path="/admin/groups/secretary-responsibilities"
        component={SecretaryGuide}
      />

      <Route
        exact
        path="/admin/groups/how-subgroup-works"
        component={SubgroupGuide}
      />

      <Route
        exact
        path="/admin/groups/manage"
        component={withGroup(ManageGroup)}
      />
      <Route
        exact
        path="/admin/groups/subgroup/:id"
        component={withGroup(SubgroupMembers)}
      />

      <Route
        exact
        path="/admin/groups/subgroup/user/:id"
        component={withGroup(ManageUser)}
      />
      <Route
        exact
        path="/admin/groups/invite"
        component={withGroup(InviteMember)}
      />
    </Switch>
  </Wrapper>
);

export default Group;
