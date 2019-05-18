pragma solidity >=0.4.22 <0.6.0;

import "./ITandaPayLedger.sol";
import "./ITandaPayLedgerInfo.sol";
import "./DaiContract.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

/**
* @title TandaPayLedger
* @dev ledger contract to create and process tandaGroups
*/
contract TandaPayLedger is ITandaPayLedger, ITandaPayLedgerInfo {
    DaiContract public daiContract;

    uint public groupsCount = 0;
    address internal backendAccount;
    address internal cronAccount;

    mapping(address => Group) internal groups;
    mapping(address => Policyholder) internal policyholders;
    mapping(address => mapping(uint => GroupPeriod)) internal periods;

    constructor(address daiContractAddress) public {
        daiContract = DaiContract(daiContractAddress);
        backendAccount = msg.sender;
        cronAccount = msg.sender;
    }


// ================================================== BACKEND

    function transferBackendAccount(address newAccount) public onlyBackend {
        backendAccount = newAccount;
    }


    function transferCronAccount(address newAccount) public onlyBackend {
        cronAccount = newAccount;
    }


    /**
    * @dev Create new Group and start the first period automatically.
    * @notice Preconditions:
    * 1. Group size >=50 && <=552.
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
        ) public onlyBackend
    {
        require(phAddresses.length == subgrNumbers.length);
        require(phAddresses.length <= GROUP_SIZE_AT_CREATION_MAX);
        require(phAddresses.length >= GROUP_SIZE_AT_CREATION_MIN);
        require(monthToRepayTheLoan >= MONTH_TO_REPAY_LOAN_MIN);
        require(monthToRepayTheLoan <= MONTH_TO_REPAY_LOAN_MAX);
        require(premiumCostDai > 0);
        require(maxClaimDai > 0);
        require(maxClaimDai < premiumCostDai * phAddresses.length);


        // Make the secretary a minter / allow to mint DAI
        daiContract.addMinter(secretary);

        Group memory g;
        g.secretary = secretary;
        g.monthToRepayTheLoan = monthToRepayTheLoan;
        g.premiumCostDai = premiumCostDai;
        g.maxClaimDai = maxClaimDai;
        g.createdAt = now;

        address grAddress = getUniqueAddress();
        groups[grAddress] = g;

        for(uint i = 0; i < phAddresses.length; i++) {
            Policyholder memory p = Policyholder(
                grAddress,          // group
                subgrNumbers[i],    // subgroup
                subgrNumbers[i],    // nextSubgroup
                1,                  // nextSubgroupFromPeriod
                0                   // lastPeriodPremium
            );
            policyholders[phAddresses[i]] = p;
            
            // Cannot use g.policyholders since memory outside of storage
            if(groups[grAddress].policyholders[subgrNumbers[i]].length == 0)
                groups[grAddress].subgroups.push(subgrNumbers[i]);
            groups[grAddress].policyholders[subgrNumbers[i]].push(phAddresses[i]);
        }

        groupsCount = groupsCount + 1;
        emit NewGroup(grAddress);
    }


    /**
    * @dev Add new claim. The claim amount will be automatically calculated by processGroup.
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Group is in the active state
    * 3. Claimant can’t open more that 1 claim at once
    * 4. Claimant paid premium in pre-period
    * @param grAddress Selected group address
    * @param phAddress The claimant address
    * @return event NewClaim(phAddress)
    */
    function addClaim(address grAddress, address phAddress) public
            onlyBackend 
            onlyValidGroup(grAddress) 
            onlyValidPolicyholder(phAddress)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
    {
        uint period = getCurrentPeriod(grAddress);
        require(!policyholderHasClaimed(grAddress, phAddress, period), "Policyholder has already made a claim");
        require(policyholderHasPaidPremium(phAddress, period), "Policyholder has not paid premium");

        Claim memory c = Claim(now, ClaimState.Opened);

        periods[grAddress][period].claimsMap[phAddress] = c;
        periods[grAddress][period].claims.push(phAddress);
        emit NewClaim(phAddress);
    }


    /**
    * @dev Remove policyholder from the group
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Policyholder has NOT paid premium in the current period
    * 3. Group is in pre-period or active-period
    * @param grAddress Selected group address.
    * @param phAddress Policyholder address.
    */
    function removePolicyholderFromGroup(address grAddress, address phAddress) public
            onlyBackend
            onlyValidGroup(grAddress)
            onlyValidPolicyholder(phAddress)
            onlyForThisSubperiod(grAddress, SubperiodType.PrePeriod)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
    {
        uint period = getCurrentPeriod(grAddress);
        require(!policyholderHasPaidPremium(phAddress, period), "Policyholder has paid premium");

        uint[] memory subgroups = groups[grAddress].subgroups;

        for(uint i = 0; i < subgroups.length; i++) {
            // Cannot use policyholders since memory outside of storage
            uint phLen = groups[grAddress].policyholders[subgroups[i]].length;

            for(uint j = 0; j < phLen; j++) {
                if(groups[grAddress].policyholders[subgroups[i]][j] == phAddress) {
                    // Swap with the last element and decrease length by 1 (remove)
                    groups[grAddress].policyholders[subgroups[i]][j] = groups[grAddress].policyholders[subgroups[i]][phLen - 1];
                    groups[grAddress].policyholders[subgroups[i]].length -= 1;
                    break;
                }
            }
        }

        delete policyholders[phAddress];
    }


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
    function commitPremium(address grAddress, uint amountDai) public
            onlyValidGroup(grAddress)
            onlyValidPolicyholder(msg.sender)
            onlyForThisSubperiod(grAddress, SubperiodType.PrePeriod)
    {
        uint period = getCurrentPeriod(grAddress);
        require(!policyholderHasPaidPremium(msg.sender, period), "You have already paid premium");
        require(period <= groups[grAddress].monthToRepayTheLoan);

        uint premiumToPay = getPremiumToPay(grAddress, msg.sender);
        uint overpaymentToPay = getOverpaymentToPay(grAddress, msg.sender);
        uint loanRepaymentToPay = getLoanRepaymentToPay(grAddress, msg.sender);
        require(amountDai == premiumToPay + overpaymentToPay + loanRepaymentToPay, "Insufficient amount of DAI");

        periods[grAddress][period].premiumsTotalDai += premiumToPay;
        periods[grAddress][period].overpaymentTotalDai += overpaymentToPay;
        periods[grAddress][period].loanRepaymentTotalDai += loanRepaymentToPay;
        
        policyholders[msg.sender].lastPeriodPremium = period;
        
        daiContract.transferFrom(msg.sender, address(this), amountDai);
        
        emit PremiumCommited(msg.sender, amountDai);
    }


    /**
    * @dev Register the next subgroup in next period.
    * The subgroup will be changed automatically when the 27 days of active period ends.
    * @notice Preconditions:
    * 1. Group address and policyholder address are valid
    * 2. Group is in the active-period
    * 3. Policyholder has no open claims
    * 4. Policyholder has no open subgroup requests
    * @param grAddress Selected group address.
    * @param newSubgroup New subgroup number.
    */
    function addChangeSubgroupRequest(address grAddress, uint newSubgroup) public
            onlyValidGroup(grAddress)
            onlyValidPolicyholder(msg.sender)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
    {
        uint period = getCurrentPeriod(grAddress);
        require(policyholders[msg.sender].nextSubgroupFromPeriod != period + 1, "You have already requested a subgroup change");
        require(!policyholderHasClaimed(grAddress, msg.sender, period), "Cannot request subgroup change after making a claim");

        policyholders[msg.sender].subgroup = policyholders[msg.sender].nextSubgroup;
        policyholders[msg.sender].nextSubgroup = newSubgroup;
        policyholders[msg.sender].nextSubgroupFromPeriod = period + 1;
    }


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
    function finalizeClaims(address grAddress, bool loyalist) public
            onlyValidGroup(grAddress)
            onlyValidPolicyholder(msg.sender)
            onlyForThisSubperiod(grAddress, SubperiodType.PostPeriod)
    {
        uint period = getCurrentPeriod(grAddress) - 1;
        bool policyholderHasVoted = policyholderHasVoted(grAddress, msg.sender, period);
        bool policyholderHasClaimed = policyholderHasClaimed(grAddress, msg.sender, period);
        require(!policyholderHasVoted);
        require(!policyholderHasClaimed);
        
        if(loyalist)
            periods[grAddress][period].loyalists.push(msg.sender);
        else
            periods[grAddress][period].defectors.push(msg.sender);

        emit ClaimFinalized(grAddress, period, policyholderHasVoted, policyholderHasClaimed);
    }


// ================================================== INFO

    /**
    * @dev Get the group basic info that is set in constructor
    * @notice This info should never change after group is created
    * @param grAddress Selected group address
    */
    function getGroupInfo(address grAddress) public view 
            onlyValidGroup(grAddress) 
            returns(address secretary, uint policyholdersCount, uint[] memory subgroups, uint monthToRepayTheLoan, uint premiumCostDai, uint maxClaimDai, uint createdAt) 
    {
        Group memory g = groups[grAddress];

        uint count = 0;
        for(uint i = 0; i < g.subgroups.length; i++) {
            count += groups[grAddress].policyholders[g.subgroups[i]].length;
        }

        secretary = g.secretary;
        policyholdersCount = count;
        subgroups = g.subgroups;
        monthToRepayTheLoan = g.monthToRepayTheLoan;
        premiumCostDai = g.premiumCostDai;
        maxClaimDai = g.maxClaimDai;
        createdAt = g.createdAt;
    }


    /**
    * @dev Get the group info in a period
    * @param grAddress Selected group address
    */
    function getGroupPeriodInfo(address grAddress, uint period) public view
            onlyValidGroup(grAddress)
            returns(uint premiumsTotalDai, uint overpaymentTotalDai, uint loanRepaymentTotalDai)
    {
        GroupPeriod memory gp = periods[grAddress][period];

        premiumsTotalDai = gp.premiumsTotalDai;
        overpaymentTotalDai = gp.overpaymentTotalDai;
        loanRepaymentTotalDai = gp.loanRepaymentTotalDai;
    }


    /**
    * @dev Get the sub-group info
    * @param grAddress Selected group address
    * @param subgroup Selected subgroup number
    */
    function getSubgroupInfo(address grAddress, uint subgroup) public view
            onlyValidGroup(grAddress)
            onlyValidSubgroup(grAddress, subgroup)
            returns(uint policyholdersCount, address[] memory phAddresses)
    {
        phAddresses = groups[grAddress].policyholders[subgroup];
        policyholdersCount = groups[grAddress].policyholders[subgroup].length;
    }


    /**
    * @dev Get the policyholder Info
    * @notice If no subgroup change is requested -> subgroup == nextSubgroup
    * @param phAddress Selected policyholder address
    */
    function getPolicyholderInfo(address phAddress) public view
            returns(address group, uint subgroup, uint nextSubgroup, uint lastPeriodPremium, PolicyholderStatus status)
    {
        Policyholder memory p = policyholders[phAddress];
        group = p.group;
        subgroup = p.subgroup;
        nextSubgroup = p.nextSubgroup;
        lastPeriodPremium = p.lastPeriodPremium;
        status = getPolicyHolderStatus(phAddress);
    }


    /**
    * @dev Get the amount that should be paid by a policyholder for the current period 
    * @notice If policyholder has already paid -> will return 0
    * @notice Only callable during the pre-period
    * @param grAddress Selected group address
    * @param phAddress Selected policyholder address
    */
    function getAmountToPay(address grAddress, address phAddress) public view
            onlyValidGroup(grAddress)
            onlyValidPolicyholder(phAddress)
            onlyForThisSubperiod(grAddress, SubperiodType.PrePeriod)
            returns(uint premiumDai, uint overpaymentDai, uint loanRepaymentDai)
    {
        require(getCurrentPeriod(grAddress) <= groups[grAddress].monthToRepayTheLoan);
        
        premiumDai = getPremiumToPay(grAddress, phAddress);
        loanRepaymentDai = getLoanRepaymentToPay(grAddress, phAddress);
        overpaymentDai = getOverpaymentToPay(grAddress, phAddress);
    }


    /**
    * @dev Get the current period info
    * @param grAddress Selected group address
    */
    function getCurrentPeriodInfo(address grAddress) public view
            onlyValidGroup(grAddress)
            returns(uint period, SubperiodType subperiodType)
    {
        period = getCurrentPeriod(grAddress);
        subperiodType = getSubperiodType(grAddress, period);
    }


    /**
    * @dev Get the current claim count 
    * @notice Only callable during active period and post-period
    * @param grAddress Selected group address
    * @param period Selected period
    */
    function getClaimCount(address grAddress, uint period) public view
            onlyValidGroup(grAddress)
            onlyValidPeriod(grAddress, period)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
            onlyForThisSubperiod(grAddress, SubperiodType.PostPeriod)
            returns(uint count)
    {
        count = periods[grAddress][period].claims.length;
    }


    /**
    * @dev Get the claim info
    * @notice Only callable during active period and post-period
    * @param grAddress Selected group address
    * @param period Selected period
    * @param claimant Selected claim address (or the claimant's address)
    *
    * If claim is still not finalized -> claimAmountDai = (_premiumCostDai * group count) / numberOfOpenClaims
    * (but never more than _maxClaimDai)
    * 		
    * If claim is finalized and approved -> claimAmountDai (_premiumCostDai * group count) / numberOfAprovedClaims
    * (but never more than _maxClaimDai)
    *	
    * If claim is finalized and rejected -> claimAmountDai is ZERO
    */
    function getClaimInfo(address grAddress, uint period, address claimant) public view
            onlyValidGroup(grAddress)
            onlyValidPeriod(grAddress, period)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
            onlyForThisSubperiod(grAddress, SubperiodType.PostPeriod)
            onlyValidClaimant(grAddress, period, claimant)
            returns(ClaimState claimState, uint claimAmountDai)
    {
        claimState = getClaimState(grAddress, period, claimant);
        claimAmountDai = getClaimAmount(grAddress, period, claimant);
    }


    /**
    * @dev Get the group claim info
    * @notice Only callable during active period and post-period
    * @param grAddress Selected group address
    * @param period Selected period
    */
    function getGroupClaimInfo(address grAddress, uint period) public view 
            onlyValidGroup(grAddress)
            onlyValidPeriod(grAddress, period)
            onlyForThisSubperiod(grAddress, SubperiodType.ActivePeriod)
            onlyForThisSubperiod(grAddress, SubperiodType.PostPeriod)
            returns (address[] memory loyalists, address[] memory defectors)
    {
        loyalists = periods[grAddress][period].loyalists;
        defectors = periods[grAddress][period].defectors;
    }


// ================================================== HELPERS

    function getClaimState(address grAddress, uint period, address claimant) internal view returns(ClaimState) {
        if(periods[grAddress][period].claimsMap[claimant].claimState == ClaimState.Paid)
            return ClaimState.Paid;
        else if(isClaimRejected(grAddress, period, claimant))
            return ClaimState.Rejected;
        else if(getSubperiodType(grAddress, period) == SubperiodType.ActivePeriod)
            return ClaimState.Opened;
        else if(getSubperiodType(grAddress, period) == SubperiodType.PostPeriod)
            return ClaimState.Finalizing;
        else
            revert("Nope");  // Can never happen
    }


    // Return true if 2 or more members of the same subgroup try to claim
    function isClaimRejected(address grAddress, uint period, address claimant) internal view returns(bool isRejected) {
        address[] memory defectors = periods[grAddress][period].defectors;
        Policyholder memory p = policyholders[claimant];

        uint count = 0;
        for(uint i = 0; i < defectors.length; i++) {
            Policyholder memory d = policyholders[defectors[i]];
            if(d.subgroup == p.subgroup)
                count++;
        }

        isRejected = count >= 2;
    }


    function getClaimAmount(address grAddress, uint period, address claimant) internal view returns(uint) {
        ClaimState cs = getClaimState(grAddress, period, claimant);
        
        if((cs != ClaimState.Finalizing && cs != ClaimState.Paid) || isClaimRejected(grAddress, period, claimant)) {
            return 0;
        }

        uint nonRejectedClaimsCount = 0;
        address[] memory claims = periods[grAddress][period].claims;
        for(uint i = 0; i < claims.length; i++) {
            if(!isClaimRejected(grAddress, period, claims[i])) {
                nonRejectedClaimsCount++;
            }
        }

        uint defected = groups[grAddress].premiumCostDai * periods[grAddress][period].defectors.length;
        uint premiumFund = periods[grAddress][period].premiumsTotalDai - defected;
        
        uint claimAmount = premiumFund / nonRejectedClaimsCount;
        if(claimAmount <= groups[grAddress].maxClaimDai) {
            return claimAmount;
        } else {
            return groups[grAddress].maxClaimDai;
        }
    }

    /**
        NOT WORKING YET
     */
    function processGroup(address grAddress) public onlyCron onlyForThisSubperiod(grAddress, SubperiodType.PostPeriod) {
        uint period = getCurrentPeriod(grAddress) - 1;

        // Send all claimRewards to claimants
        uint premiumToClaims;
        address[] memory claims = periods[grAddress][period].claims;

        for(uint i = 0; i < claims.length; i++) {
            if(getClaimState(grAddress, period, claims[i]) == ClaimState.Finalizing) {
                processClaim(grAddress, period, claims[i]);
                premiumToClaims += getClaimAmount(grAddress, period, claims[i]);
            }
        }

        // refund for defectors
        for(uint i = 0; i < periods[grAddress][period].defectors.length; i++) {
            daiContract.transfer(periods[grAddress][period].defectors[i], groups[grAddress].premiumCostDai);
        }

        // refund premiums
        uint premiumToRefund = periods[grAddress][period].premiumsTotalDai
            - (groups[grAddress].premiumCostDai * periods[grAddress][period].defectors.length)
            - premiumToClaims;
                    
        uint premiumCount = periods[grAddress][period].premiumsTotalDai / groups[grAddress].premiumCostDai;
        // emit premiumToRefundEVENT(premiumToRefund, periods[grAddress][period].premiumsTotalDai, premiumToClaims);
        if(premiumToRefund > 0) {
            for(uint i = 0; i < premiumCount; i++) {
                // daiContract.transfer(policyholders[grAddress][i].phAddress, (premiumToRefund / premiumCount));
            }
        }
        // send money to secretary
        if(period == groups[grAddress].monthToRepayTheLoan) {
            uint loanRepaymentAllPeriods = 0;
            for(uint i = 1; i <= groups[grAddress].monthToRepayTheLoan; i++) {
                loanRepaymentAllPeriods += periods[grAddress][i].loanRepaymentTotalDai;
            }
            
            daiContract.transfer(groups[grAddress].secretary, loanRepaymentAllPeriods);
        }
    }


    function processClaim(address grAddress, uint period, address claimant) internal 
            onlyValidGroup(grAddress)
            onlyValidPeriod(grAddress, period)
            onlyValidClaimant(grAddress, period, claimant)
    {
        require(getClaimState(grAddress, period, claimant) == ClaimState.Finalizing, "Not in Finalizing State");

        if(isClaimRejected(grAddress, period, claimant)) {
            periods[grAddress][period].claimsMap[claimant].claimState = ClaimState.Rejected;
        } else {
            if(getClaimAmount(grAddress, period, claimant) > 0) {
                daiContract.transfer(claimant, getClaimAmount(grAddress, period, claimant));		
            }		
            periods[grAddress][period].claimsMap[claimant].claimState = ClaimState.Paid;			
        }
    }


// ================================================== HELPERS

    function getUniqueAddress() internal view returns (address) {
        bytes20 b = bytes20(keccak256(abi.encodePacked(msg.sender, now)));
        uint addr = 0;
        for (uint i = 0; i < b.length; i++) {
            addr += uint(uint8(b[i])) * ( 16 ** ((b.length - i - 1) * 2));
        }
        return address(addr);
    }


    function getCurrentPeriod(address grAddress) internal view returns(uint) {
        uint timePassed = (now - groups[grAddress].createdAt);
        uint periodLength = 27 days;
        return 1 + (timePassed / periodLength); // TODO: check it
    }


    function getSubperiodType(address grAddress, uint period) internal view returns(SubperiodType) {
        uint timePassed = (now - groups[grAddress].createdAt);
        uint dayNum = timePassed / (1 days);
        uint periodDayNum = dayNum - 30 * (period - 1);

        if(30 * (period - 1) > dayNum)                      return SubperiodType.BeforePeriod;
        else if(periodDayNum < 3)                           return SubperiodType.PrePeriod;
        else if(periodDayNum >= 3 && periodDayNum < 33)     return SubperiodType.ActivePeriod;
        else if(periodDayNum >= 33 && periodDayNum < 36)    return SubperiodType.PostPeriod;
        else                                                return SubperiodType.OutOfPeriod;
    }


    function policyholderHasClaimed(address grAddress, address phAddress, uint period) internal view returns(bool) {	
        return periods[grAddress][period].claimsMap[phAddress].createdAt > 0;
    }

    
    function policyholderHasPaidPremium(address phAddress, uint period) internal view returns(bool) {
        return period == policyholders[phAddress].lastPeriodPremium;
    }


    function policyholderHasVoted(address grAddress, address phAddress, uint period)	internal view returns(bool) {
        GroupPeriod memory gp = periods[grAddress][period];
        uint loyalLen = gp.loyalists.length;
        uint defectLen = gp.defectors.length;

        for(uint i = 0; i < loyalLen; i++) {
            if(gp.loyalists[i] == phAddress) {
                return true;
            }
        }
        for(uint i = 0; i < defectLen; i++) {
            if(gp.defectors[i] == phAddress) {
                return true;
            }
        }
    }


    function getPremiumToPay(address grAddress, address phAddress) internal view returns(uint) {
        if(policyholderHasPaidPremium(phAddress, getCurrentPeriod(grAddress)))
            return 0;
        return groups[grAddress].premiumCostDai;
    }


    function getLoanRepaymentToPay(address grAddress, address phAddress) internal view returns(uint) {
        uint MTR = 3; // TODO: ???
        return (groups[grAddress].premiumCostDai + getOverpaymentToPay(grAddress, phAddress)) / (MTR - 1);
    }


    function getOverpaymentToPay(address grAddress, address phAddress) internal view returns(uint) {	
        uint subgroupMembersCount = groups[grAddress].policyholders[policyholders[phAddress].subgroup].length;
        return (getCurrentSubgroupOverpayment(subgroupMembersCount) * groups[grAddress].premiumCostDai) / 1000;
    }


    function getCurrentSubgroupOverpayment(uint subgroupMembersCount) internal pure returns(uint) {
        if(subgroupMembersCount == 4)
            return 333;
        else if(subgroupMembersCount == 5)
            return 250;
        else if(subgroupMembersCount == 6)
            return 200;
        else if(subgroupMembersCount == 7)
            return 167;
        return 0;
    }


    function getPolicyHolderStatus(address phAddress) internal view returns(PolicyholderStatus) {
        address grAddress = policyholders[phAddress].group;
        uint period = getCurrentPeriod(grAddress);
        if(policyholderHasClaimed(grAddress, phAddress, period))
            return PolicyholderStatus.OpenedClaim;
        else if(policyholderHasPaidPremium(phAddress, period))
            return PolicyholderStatus.PremiumPaid;
        else
            return PolicyholderStatus.PremiumUnpaid;
    }	


// ================================================== MODIFIERS

    modifier onlyBackend() {
        require(msg.sender == backendAccount, "Not Backend");
        _;
    }

    modifier onlyCron() {
        require(msg.sender == cronAccount, "Not Cron");
        _;
    }

    modifier onlyValidPolicyholder(address phAddress) {
        require(policyholders[phAddress].group > address(0), "Invalid Policyholder");
        _;
    }

    modifier onlyValidGroup(address grAddress) {
        require(groups[grAddress].secretary > address(0), "Invalid Group");
        _;
    }

    modifier onlyValidPeriod(address grAddress, uint period) {
        require(period <= getCurrentPeriod(grAddress), "Invalid Period");
        _;
    }

    modifier onlyValidClaimant(address grAddress, uint period, address claimant) {
        require(periods[grAddress][period].claimsMap[claimant].createdAt > 0, "Invalid Claim");
        _;
    }

    modifier onlyValidSubgroup(address grAddress, uint subgroup) {
        require(groups[grAddress].policyholders[subgroup].length > 0, "Invalid Subgroup");
        _;
    }

    modifier onlyForThisSubperiod(address grAddress, SubperiodType subperiodType) {
        if(subperiodType == SubperiodType.PrePeriod)
            require(subperiodType == getSubperiodType(grAddress, getCurrentPeriod(grAddress)), "Not in Pre Period");
        else if(subperiodType == SubperiodType.ActivePeriod)
            require(subperiodType == getSubperiodType(grAddress, getCurrentPeriod(grAddress)), "Not in Active Period");
        else
            require(subperiodType == getSubperiodType(grAddress, getCurrentPeriod(grAddress) - 1), "Not in Post Period");
        _;
    }

}
