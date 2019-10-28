const headRows = [
  {
    id: "claimantName",
    numeric: false,
    disablePadding: true,
    label: "Name (Claim Creator)"
  },
  {
    id: "subgroupName",
    numeric: true,
    disablePadding: false,
    label: "Subgroup"
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Claim Status"
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Creation Date"
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Claim Disbursement"
  },
  {
    id: "_id",
    numeric: false,
    disablePadding: false,
    label: "Actions"
  }
];

export { headRows };
