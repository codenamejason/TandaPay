import React from "react";
import { Link } from "react-router-dom";
import {
  withStyles,
  TableRow,
  TableCell,
  Typography,
  Button
} from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import styles from "../table.style";

/**
 * @summary
 * @type {React.Component} - functional component
 * @pure - Uses no state or hooks
 */
const EnhancedTableRowPremium = props => {
  const { classes, data, type, labelId, headRows } = props;
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell padding="checkbox" />
      <TableCell component="th" id={labelId} scope="row" padding="none">
        <Typography className={classes.name}>{data[headRows[0].id]}</Typography>
      </TableCell>
      <TableCell align="left">
        {" "}
        {moment(data[headRows[1].id]).format("MM/DD/YYYY")}
      </TableCell>

      <TableCell align="left">{data[headRows[2].id]}</TableCell>
      <TableCell align="left">
        <Typography className={classes.amount}>
          {data[headRows[3].id]}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <a
          href={"https://rinkeby.etherscan.io/tx/" + data.transactionHash}
          target="_blank"
        >
          REVIEW
        </a>
      </TableCell>
    </TableRow>
  );
};

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export default withStyles(styles, { withTheme: true })(EnhancedTableRowPremium);
