import React from "react";
import { Link } from "react-router-dom";
import {
    withStyles,
    TableRow,
    TableCell,
    Typography,
    Button,
} from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import styles from "../table.style";

/**
 * @summary
 * @type {React.Component} - functional component
 * @pure - Uses no state or hooks
 */
const EnhancedTableRow = props => {
    const { classes, data, type, labelId } = props;
    return (
        <TableRow hover tabIndex={-1}>
            <TableCell padding="checkbox" />
            <TableCell component="th" id={labelId} scope="row" padding="none">
                <Typography className={classes.name}>{data.name}</Typography>
            </TableCell>
            <TableCell align="left">{data.subgroup}</TableCell>
            <TableCell align="left">
                <Typography
                    className={clsx(classes.status, {
                        [classes.pending]: data.status === "pending",
                        [classes.denied]: data.status === "denied",
                        [classes.approved]: data.status === "approved",
                    })}
                >
                    {data.status.toUpperCase()}
                </Typography>
            </TableCell>
            <TableCell align="left">
                {moment(data.createdAt).format("MM/DD/YYYY")}
            </TableCell>
            <TableCell align="left">
                <Typography className={classes.amount}>
                    $ {data.amount}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Button
                    variant="contained"
                    to={`/admin/${type}/${data.objectID}`}
                    component={RegLink}
                    className={classes.button}
                >
                    REVIEW
                </Button>
            </TableCell>
        </TableRow>
    );
};

const RegLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} {...props} />
));

export default withStyles(styles, { withTheme: true })(EnhancedTableRow);
