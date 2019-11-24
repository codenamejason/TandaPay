const headRows = [
  {
    id: "senderName",
    numeric: false,
    disablePadding: true,
    label: "Name"
  },

  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Payment Date"
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Payment Amount"
  },

  {
    id: "period",
    numeric: true,
    disablePadding: false,
    label: "Payment Period"
  },

  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Actions"
  }
];

export { headRows };
