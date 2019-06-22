import React from "react";
import { withStyles } from "@material-ui/core";
import PageHeader from "../../../../components/PageHeader";
import styles from "./advanced.style";

const headerText = "My Profile";
const headerButtons = [
    {
        text: "GO BACK",
        type: "blue",
        url: "/admin/profile/",
    },
];
const AdvancedSettings = () => {
    return (
        <div>
            <PageHeader title={headerText} buttons={headerButtons} />
            <h1>Advanced Settings</h1>
        </div>
    );
};

export default withStyles(styles, { withTheme: true })(AdvancedSettings);
