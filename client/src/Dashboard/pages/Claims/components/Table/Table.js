import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Table,
	TableBody,
	TableCell,
	TablePagination,
	TableRow,
	Paper,
	Button
} from "@material-ui/core";

import EnhancedTableToolbar from "./components/Toolbar";
import EnhancedTableHead from "./components/TableHead";
import { createData, getSorting, stableSort } from "./utils";

const rows = [
	createData("Cupcake", 305, 3.7, 67, 4.3),
	createData("Donut", 452, 25.0, 51, 4.9),
	createData("Eclair", 262, 16.0, 24, 6.0),
	createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
	createData("Gingerbread", 356, 16.0, 49, 3.9),
	createData("Honeycomb", 408, 3.2, 87, 6.5),
	createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
	createData("Jelly Bean", 375, 0.0, 94, 0.0),
	createData("KitKat", 518, 26.0, 65, 7.0),
	createData("Lollipop", 392, 0.2, 98, 0.0),
	createData("Marshmallow", 318, 0, 81, 2.0),
	createData("Nougat", 360, 19.0, 9, 37.0),
	createData("Oreo", 437, 18.0, 63, 4.0)
];

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(3)
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	tableWrapper: {
		overflowX: "auto"
	}
}));

export default function EnhancedTable() {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
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
							rowCount={rows.length}
						/>
						<TableBody>
							{stableSort(rows, getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow hover tabIndex={-1} key={row.name}>
											<TableCell padding="checkbox" />
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{row.name}
											</TableCell>
											<TableCell align="left">{row.calories}</TableCell>
											<TableCell align="left">{row.fat}</TableCell>
											<TableCell align="left">{row.carbs}</TableCell>
											<TableCell align="left">{row.protein}</TableCell>
											<TableCell align="left">
												<Button variant="contained">REVIEW</Button>
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
					count={rows.length}
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
		</div>
	);
}
