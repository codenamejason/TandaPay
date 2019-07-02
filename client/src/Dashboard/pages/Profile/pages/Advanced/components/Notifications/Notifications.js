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

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifs: [
                {
                    code: "claim_created",
                    sms: false,
                    email: true,
                },
                {
                    code: "claim_updated",
                    sms: false,
                    email: false,
                },
                {
                    code: "claim_approved",
                    sms: true,
                    email: true,
                },
                {
                    code: "premium_paid",
                    sms: false,
                    email: false,
                },
            ],
        };
    }

    render() {
        let { classes } = this.props;
        let { notifs } = this.state;

        return (
            <Grid item xs={12} sm={7} className={classes.container}>
                <Paper>
                    <div className={classes.spaceBetween}>
                        <Typography className={classes.heading} variant="h5">
                            Notifications
                        </Typography>
                        <Typography
                            className={
                                classes.heading + " " + classes.saveStatus
                            }
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
                        <TableBody>{notifs.map(this.renderRow)}</TableBody>
                    </Table>
                </Paper>
            </Grid>
        );
    }

    renderRow = notif => {
        return (
            <TableRow key={notif.code}>
                <TableCell>{NOTIFICATION_NAMES[notif.code]}</TableCell>
                <TableCell>
                    <Checkbox
                        checked={notif.sms}
                        onChange={this.handleChange("sms", notif.code)}
                    />
                </TableCell>
                <TableCell>
                    <Checkbox
                        checked={notif.email}
                        onChange={this.handleChange("email", notif.code)}
                    />
                </TableCell>
            </TableRow>
        );
    };

    handleChange = (domain, code) => (evt) => {
        let notif = this.state.notifs.find(n => n.code === code);
        notif[domain] = !notif[domain];
        this.setState(this.state);
    };
}

const NOTIFICATION_NAMES = {
    premium_paid: "Premium Paid",
    claim_created: "Claim Created",
    claim_updated: "Claim Updated",
    claim_approved: "Claim Approved",
};

export default withStyles(styles, { withTheme: true })(Notifications);
