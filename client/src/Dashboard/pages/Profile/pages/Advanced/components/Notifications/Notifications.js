import React from "react";
import {
    Grid,
    Typography,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
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
            <Paper>
                <div className={classes.spaceBetween}>
                    <Typography className={classes.heading} variant="h5">
                        Notifications
                    </Typography>
                    <Typography
                        className={classes.heading + " " + classes.saveStatus}
                        variant="body2"
                    >
                        Saving...
                    </Typography>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Notification</TableCell>
                            <TableCell>SMS</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {NOTIFICATION_TYPES.map(n => (
                            <Row key={n.code} notif={n} />
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Grid>
    );

    function Row({ notif }) {
        return (
            <TableRow>
                <TableCell>{notif.name}</TableCell>
                <TableCell>
                    <Checkbox checked={false} />
                </TableCell>
                <TableCell>
                    <Checkbox checked={false} />
                </TableCell>
            </TableRow>
        );
    }
};

export default withStyles(styles, { withTheme: true })(Notifications);
