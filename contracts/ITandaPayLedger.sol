pragma solidity >=0.4.22 <0.6.0;

/**
* @title ITandaPayLedger 
* @dev Main TandaPayLedger interface
*/
contract ITandaPayLedger {
    uint public GROUP_SIZE_AT_CREATION_MIN = 50;
    uint public GROUP_SIZE_AT_CREATION_MAX = 55;
    uint public MONTH_TO_REPAY_LOAN_MIN = 3;
    uint public MONTH_TO_REPAY_LOAN_MAX = 255;
    uint public MAX_SUBGROUP_MEMBERS_COUNT = 7;


// ================================================== BACKEND

    function transferBackendAccount(address newAccount) public;

    function transferCronAccount(address newAccount) public;
    

    /**
    * @dev Create new Group and start the first period automatically.
    * @notice Preconditions:
    * 1. Group size >=50 && <=55.
    * 2. Month to repay loan >= 3 && <= 255
    * 3. Each policyholder has an assigned subgroup number
    * 4. Premium cost (for each policyholder) in Dai > 0
    * 6. Max amount each claim in Dai > 0 && < Max amount of Dai, which is premiumCostDai * phAddresses.length
    * @param secretary Address of the secretary
    * @param phAddresses Array of all policyholder addresses;
    * @param subgrNumbers Array of subgroup indexes for each policyholders from phAddresses array.
    * @param monthToRepayTheLoan (Not sure what this is)
    * @param premiumCostDai Specified in Wei, 1 DAI is 10^18. Example: $20
    * @param maxClaimDai Specified in Wei, 1 DAI is 10^18. Example: $500. 
    * @return grAddress. New group's address (or ID, used to key-ing the group in groups mapping)
    */
    function createNewTandaGroup(
        address secretary,
        address[] memory phAddresses,
        uint[] memory subgrNumbers,
        uint monthToRepayTheLoan, 
        uint premiumCostDai,
        uint maxClaimDai
        ) public;


    /**
    * @dev Add new claim. The claim amount will be automatically calculated by processGroup.
    * @notice Preconditions:
    * 1. Group address and claimant's address are valid
    * 2. Group is in the active state
    * 3. Claimant can’t open more that 1 claim at once
    * 4. Claimant paid premium in pre-period
    * @param grAddress Selected group address
    * @param phAddress The claimant address
    * @return event NewClaim(phAddress)
    */
    function addClaim(
        address grAddress, 
        address phAddress
        ) public;


    /**
    * @dev Remove policyholder from the group
    * @notice Preconditions:
    * 1. Group address and ph's address are valid
    * 2. Policyholder has NOT paid premium in the current period
    * 3. Group is in pre-period or active period
    * @param grAddress Selected group address.
    * @param phAddress Policyholder address.
    */
    function removePolicyholderFromGroup(
        address grAddress,
        address phAddress
        ) public;


// ================================================== POLICYHOLDER

    /**
    * @dev Commit premium. Called by policyholder after DAIs are transferred from wallet to current smart contract.
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Policyholder allowed smart contract to withdraw correct amount of DAIs (approve/allow) - see “Calculating the Individual Loan Payment value”, i.e: $37.5)
    * 3. Group is in the pre-period
    * 4. User hasn’t paid before
    * 5. The amountDai is correct (should be equal to getAmountToPay())
    * @param grAddress Selected group address.
    * @param amountDai Amount of commited to the current contract ERC20 DAIs.
    */
    function commitPremium(
        address grAddress, 
        uint amountDai
        ) public;


    /**
    * @dev Register the next subgroup in next period.
    * The subgroup will be changed automatically when the 27 days of active period ends.
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Group is in the active period
    * 3. Policyholder has no open claims
    * 4. Policyholder has no open subgroup requests
    * @param grAddress Selected group address.
    * @param newSubgroup New subgroup number.
    */
    function addChangeSubgroupRequest(
        address grAddress, 
        uint newSubgroup
        ) public;


    /**
    * @dev Finalize all opened claims by selecting either Loyalist or Defector option.
    * When post-period ends -> claimants will received money if allowed.
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Group is in post-period.
    * 3. Policyholder hasn’t selected loyalist/defector option before.
    * 4. Policyholder hasn’t opened claim in this period (in this case he is loyalist by default)
    * 5. Claim ID is valid.
    * @param grAddress Selected group address.
    * @param loyalist (Not sure what this is)
    */
    function finalizeClaims(
        address grAddress, 
        bool loyalist
        ) public;
}

