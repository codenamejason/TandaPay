import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";

import { GroupDashboard } from "./pages";
import ManageUser from "./pages/ManageUser/ManageUser";
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
        path="/holder/groups/subgroup/user/:id"
        component={withGroup(ManageUser)}
      />
      <Route
        exact
        path="/holder/groups/subgroup/:id"
        component={withGroup(SubgroupMembers)}
      />{" "}
    </Switch>
  </Wrapper>
);

export default Group;
