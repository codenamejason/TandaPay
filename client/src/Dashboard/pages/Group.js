import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Button,
    Grid,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as actions from "../../actions";
import PageHeader from "../components/PageHeader";

const Group = props => {
    let { group, classes } = props;

    if (!group) {
        props.fetchGroup();
        return <main className={classes.content}>Loading...</main>;
    }

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <PageHeader title={group.groupName + " Information"} />
            <Typography variant="h4">Members</Typography>

            <Paper>
                <Table>
                    <TableBody>
                        {group.members.map(member => (
                            <TableRow style={{ fontSize: 14 }}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>
                                    <StandingLabel
                                        standing="good"
                                        classes={classes}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>material-ui
            </Paper>
        </main>
    );
};

const StandingLabel = ({ standing, classes }) => (
    <span className={classes.standing + " " + classes[standing]}>
        {standing.substr(0, 1).toUpperCase() + standing.substr(1)}
    </span>
);

function mapStateToProps({ group }) {
    return { group };
}

const styles = theme => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    standing: {
        fontWeight: "bold",
        border: "1px solid",
        padding: "2px 2px 1px 2px",
        margin: "0px 2px",
    },
    good: {
        color: "#2ECC40",
        borderColor: "#2ECC40",
    },
    okay: {
        color: "#FFDC00",
        borderColor: "#FFDC00",
    },
    bad: {
        color: "#FF4136",
        borderColor: "#FF4136",
    },
});

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(Group));
