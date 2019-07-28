/**
 * @summary
 * @param {Array} claims
 * @param {*} data
 */
const getStats = (type, data) => {
  //if the data object is either null or undefined
  //unless the type of data you're querying is for the wallet card
  if (!data && type !== "wallet") {
    const val = 0;
    return [val.toFixed(2), "LOADING INFO"];
  }
  switch (type) {
    case "claims": {
      console.log(data);
      return [0, "INCOMPLETE"];
    }
    case "payment": {
      console.log(data);
      return [0, "INCOMPLETE"];
    }
    case "wallet": {
      return [0, "INCOMPLETE"];
    }
    default: {
      const val = 0;
      return [val.toFixed(2), "INVALID TYPE PROVIDED"];
    }
  }
  // const numOfClaimsApproved = claims.filter(
  //   claim => claim.status === "approved"
  // ).length;
  // //uses the claims array of the current group to determine
  // //the number of approved claims and the total number of claims in the group.
  // const claimStats = {
  //   title: "Group Claims",
  //   type: "claims",
  //   amount: claims.length.toFixed(2),
  //   format: "#",
  //   extra: `${numOfClaimsApproved.toFixed(2)} CLAIMS APPROVED`
  // };
  // const groupStats = {
  //   title: "Upcoming Payment",
  //   type: "payment",
  //   amount: group._id === null ? "N/A" : group.premium,
  //   format: group._id === null ? "" : "$",
  //   extra: group._id === null ? "GROUP MUST BE CREATED" : group.paymentDate
  // };
  // const walletStats = {
  //   title: "Wallet Funds",
  //   type: "wallet",
  //   amount: "675.00",
  //   format: "$",
  //   extra: "UNFINISHED"
  // };
  // return [walletStats, groupStats, claimStats];
};

export { getStats };
