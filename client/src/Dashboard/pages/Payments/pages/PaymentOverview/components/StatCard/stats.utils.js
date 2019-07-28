import { getDAIBalance } from "../../../../../../../web3";

/**
 * @summary
 * @param {Array} claims
 * @param {*} data
 */
const getStats = async (type, data) => {
  //if the data object is either null or undefined
  //unless the type of data you're querying is for the wallet card
  if (!data && type !== "wallet") {
    const val = 0;
    return [val.toFixed(2), "LOADING INFO"];
  }
  switch (type) {
    case "claims": {
      const [amount, extra] = getClaimStat(data);
      return [amount.toFixed(2), extra];
    }
    case "payment": {
      const [amount, extra] = getGroupStat(data);
      return [amount, extra];
    }
    case "wallet": {
      const [amount, extra] = await getWalletStat();
      return [`~ ${amount}`, extra];
    }
    default: {
      const val = 0;
      return [val.toFixed(2), "INVALID TYPE PROVIDED"];
    }
  }
};

/**
 * @summary
 */
const getWalletStat = async () => {
  const [amount, error] = await getDAIBalance();
  if (error) {
    return ["N/A", "ERROR GETTING BALANCE"];
  } else {
    return [amount, "ESTIMATED FROM EXCHANGE RATE"];
  }
};

/**
 * @summary
 * @param {Object} group
 */
const getGroupStat = group => {
  const amount = group._id === null ? "N/A" : group.premium;
  const extra =
    group._id === null ? "GROUP MUST BE CREATED" : group.paymentDate;

  return [amount, extra];
};

/**
 *
 * @param {Array} claims
 */
const getClaimStat = claims => {
  const numOfClaimsApproved = claims.filter(
    claim => claim.status === "approved"
  ).length;

  return [claims.length, `${numOfClaimsApproved} APPROVED`];
};
export { getStats };
