import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Switch, Route } from "react-router-dom";
import styles from "../../../Nav/SideBar/sidebar.style";
import BasicSettings from "./pages/Basic/BasicSettings";
import AdvancedSettings from "./pages/Advanced/AdvancedSettings";
const Profile = props => {
    const { classes } = props;

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
                <Route exact path="/holder/profile" component={BasicSettings} />
                <Route
                    exact
                    path="/holder/profile/advanced"
                    component={AdvancedSettings}
                />
            </Switch>
        </main>
    );
};

export default withStyles(styles, { withTheme: true })(Profile);
