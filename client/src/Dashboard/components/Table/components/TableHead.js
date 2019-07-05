import React from "react";
import {
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
} from "@material-ui/core";
import PropTypes from "prop-types";
const headRows = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Name (Claim Creator)",
    },
    { id: "subgroup", numeric: true, disablePadding: false, label: "Subgroup" },
    {
        id: "status",
        numeric: true,
        disablePadding: false,
        label: "Claim Status",
    },
    {
        id: "date",
        numeric: true,
        disablePadding: false,
        label: "Creation Date",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "Claim Disbursement",
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "Actions",
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" />
                {headRows.map(row => (
                    <TableCell
                        key={row.id}
                        align={"left"}
                        padding={row.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default EnhancedTableHead;
