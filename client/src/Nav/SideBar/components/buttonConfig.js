import React from "react";
import {
    Home as HomeIcon,
    Group as GroupIcon,
    AccountBalance as WalletIcon,
    FileCopy as ClaimsIcon,
    Help as HelpIcon,
    Settings as SettingIcon,
} from "@material-ui/icons";
const nav = {
    menuItems: ["Home", "Participants", "My Wallet", "My Claims"],
    itemProps: {
        Home: {
            icon: <HomeIcon />,
            url: "payments",
        },
       
        "My Wallet": {
            icon: <WalletIcon />,
            url: "wallet",
        },
        "My Claims": {
            icon: <ClaimsIcon />,
            url: "claims",
        },
        "Participants": {
            icon: <GroupIcon />,
            url: "groups",
        },

        
    },
};

const extra = {
    menuItems: ["Help", "Settings"],
    itemProps: {
        Help: {
            icon: <HelpIcon />,
            url: "help",
        },
        Settings: {
            icon: <SettingIcon />,
            url: "profile",
        },
    },
};

export { nav, extra };
