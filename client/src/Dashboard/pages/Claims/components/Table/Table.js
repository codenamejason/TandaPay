import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
	Table,
	TableBody,
	TableCell,
	TablePagination,
	TableRow,
	Paper,
	Button,
	Grid,
	Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
import EnhancedTableToolbar from "./components/Toolbar";
import EnhancedTableHead from "./components/TableHead";
import { getSorting, stableSort } from "./utils";
import styles from "./table.style";

function EnhancedTable(props) {
	const { classes, claims } = props;
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("date");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const RegLink = React.forwardRef((props, ref) => (
		<Link innerRef={ref} {...props} />
	));
	function handleRequestSort(event, property) {
		const isDesc = orderBy === property && order === "desc";
		setOrder(isDesc ? "asc" : "desc");
		setOrderBy(property);
	}

	function handleChangePage(event, newPage) {
		setPage(newPage);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(+event.target.value);
	}

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, claims.length - page * rowsPerPage);

	return (
		<Grid container className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar />
				<div className={classes.tableWrapper}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={"medium"}
					>
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={claims.length}
						/>
						<TableBody>
							{stableSort(claims, getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((claim, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow hover tabIndex={-1} key={claim.name}>
											<TableCell padding="checkbox" />
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												<Typography className={classes.name}>
													{claim.name}
												</Typography>
											</TableCell>
											<TableCell align="left">{claim.subgroup}</TableCell>
											<TableCell align="left">
												<Typography
													className={clsx(classes.status, {
														[classes.pending]: claim.status === "pending",
														[classes.denied]: claim.status === "denied",
														[classes.approved]: claim.status === "approved"
													})}
												>
													{claim.status.toUpperCase()}
												</Typography>
											</TableCell>
											<TableCell align="left">
												{moment(claim.createdAt).format("MM/DD/YYYY")}
											</TableCell>
											<TableCell align="left">
												<Typography className={classes.amount}>
													$ {claim.amount}
												</Typography>
											</TableCell>
											<TableCell align="left">
												<Button
													variant="contained"
													to={`/admin/claims/${claim.objectID}`}
													component={RegLink}
													className={classes.button}
												>
													REVIEW
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={claims.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						"aria-label": "Previous Page"
					}}
					nextIconButtonProps={{
						"aria-label": "Next Page"
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</Grid>
	);
}

export default withStyles(styles, { withTheme: true })(EnhancedTable);
