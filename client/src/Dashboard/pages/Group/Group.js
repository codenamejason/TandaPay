import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";

import { GroupCreator, GroupDashboard } from "./pages";
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
            <Route exact path="/admin/groups" component={GroupDashboard} />
            <Route exact path="/admin/groups/new" component={GroupCreator} />
        </Switch>
    </Wrapper>
);


export default Group;
