import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import styles from "../../Navigation/SideBar/sidebar.style";
import PageHeader from "../components/PageHeader";
const Profile = props => {
    const { classes } = props;
    const headerText = "My Profile";
    const headerButtons = [
        {
            text: "ADVANCED SETTINGS",
            type: "blue",
            url: "/admin/profile/advanced",
        },
    ];
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <PageHeader title={headerText} buttons={headerButtons} />
        </main>
    );
};

export default withStyles(styles, { withTheme: true })(Profile);
