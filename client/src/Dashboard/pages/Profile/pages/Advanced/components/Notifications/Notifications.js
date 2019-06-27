import React from "react";
import {
    Grid,
    Card,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    withStyles,
} from "@material-ui/core";

import styles from "./notifications.style";

const NOTIFICATION_TYPES = [
    {
        code: "claim_created",
        name: "Claim Created",
    },
    {
        code: "claim_updated",
        name: "Claim Updated",
    },
    {
        code: "claim_approved",
        name: "Claim Approved",
    },
    {
        code: "premiun_paid",
        name: "Premium Paid",
    },
];

const Notifications = props => {
    const { classes } = props;
    return (
        <Grid item xs={12} sm={7} className={classes.container}>
            <Card className={classes.card}>
                <Typography variant="h6">NOTIFICATION SETTINGS</Typography>
                {NOTIFICATION_TYPES.map(n => (
                    <Setting type={n} />
                ))}
            </Card>
        </Grid>
    );
};

const Setting = ({ type, sms, email }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }}
    >
        <p>{type.name}</p>
        <FormGroup row>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={false}
                        onChange={() => console.log("change")}
                    />
                }
                label="SMS"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={false}
                        onChange={() => console.log("change")}
                    />
                }
                label="Email"
            />
        </FormGroup>
    </div>
);

export default withStyles(styles, { withTheme: true })(Notifications);
