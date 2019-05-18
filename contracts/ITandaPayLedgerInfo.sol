pragma solidity >=0.4.22 <0.6.0;

/**
* @title ITandaPayLedgerInfo 
* @dev TandaPayLedgerInfo interface
*/
contract ITandaPayLedgerInfo {
    event NewGroup(address grAddress);
    event NewClaim(address phAddress);
    event PremiumCommited(address phAddress, uint amount);
    event ClaimFinalized(address grAddress, uint period, bool policyholderHasVoted, bool policyholderHasClaimed);

    struct Group {
        address secretary;
        mapping(uint => address[]) policyholders;   // subgroup => [policyholders]
        uint[] subgroups;                           // store list of subgroups for iteration through policyholders
        uint monthToRepayTheLoan;
        uint premiumCostDai;
        uint maxClaimDai;
        uint createdAt;
    }

    struct Policyholder {
        address group;
        uint subgroup;
        uint nextSubgroup;
        uint nextSubgroupFromPeriod;
        uint lastPeriodPremium;
    }

    struct Claim {
        uint createdAt;
        ClaimState claimState;
    }

    struct GroupPeriod {
        mapping(address => Claim) claimsMap;    // since each PH can make 1 claim/period so we can use PH's address for keys
                                                // easy to check if a PH has already made a claim
        address[] claims;
        address[] loyalists;
        address[] defectors;
        uint premiumsTotalDai;
        uint overpaymentTotalDai;
        uint loanRepaymentTotalDai;
    }

    enum PolicyholderStatus {
        PremiumUnpaid,
        PremiumPaid,
        OpenedClaim
    }

    enum PolicyholderClaimStatus {
        Loyalist,
        Defector
    }

    enum SubperiodType {
        PrePeriod,	    // 3 days
        ActivePeriod,	// 30 days
        PostPeriod,	    // 3 days
        BeforePeriod,
        OutOfPeriod
    }

    enum ClaimState {
        Opened,	    // no post-period is running currently
        Finalizing, // post-perdiod is currently running
        Paid,
        Rejected
    }	


    /**
    * @dev Get the group basic info that is set in constructor
    * @notice This info should never change after group is created
    * @param grAddress Selected group address
    */
    function getGroupInfo(address grAddress) public view 
        returns(address secretary, uint policyholdersCount, uint[] memory subgroups, uint monthToRepayTheLoan, uint premiumCostDai, uint maxClaimDai, uint createdAt); 


    /**
    * @dev Get the group info in a period
    * @param grAddress Selected group address
    * @param period Selected period
    */
    function getGroupPeriodInfo(address grAddress, uint period) public view 
        returns(uint premiumsTotalDai, uint overpaymentTotalDai, uint loanRepaymentTotalDai); 


    /**
    * @dev Get the sub-group info
    * @param grAddress Selected group address
    * @param subgroup Selected subgroup number
    */
    function getSubgroupInfo(address grAddress, uint subgroup) public view 
        returns(uint policyholdersCount, address[] memory policyholders);


    /**
    * @dev Get the policyholder Info
    * @notice If no subgroup change is requested -> subgroup == nextSubgroup
    * @param phAddress Selected policyholder address
    */
    function getPolicyholderInfo(address phAddress) public view 
        returns(address group, uint subgroup, uint nextSubgroup, uint lastPeriodPremium, PolicyholderStatus status);


    /**
    * @dev Get the amount that should be paid by a policyholder for the current period 
    * @notice If policyholder has already paid -> will return 0
    * @notice Only callable during the pre-period
    * @param grAddress Selected group address
    * @param phAddress Selected policyholder address
    */
    function getAmountToPay(address grAddress, address phAddress) public view 
        returns(uint premiumDai, uint overpaymentDai, uint loanRepaymentDai);


    /**
    * @dev Get the current period info
    * @param grAddress Selected group address
    */
    function getCurrentPeriodInfo(address grAddress) public view 
        returns(uint period, SubperiodType subperiodType);


    /**
    * @dev Get the current claim count 
    * @notice Only callable during active period and post-period
    * @param grAddress Selected group address
    * @param period Selected period
    */
    function getClaimCount(address grAddress, uint period) public view 
        returns(uint count);


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
        returns(ClaimState claimState, uint claimAmountDai);


    // TODO: add payout history to the method
    function getGroupClaimInfo(address grAddress, uint period) public view 
        returns(address[] memory loyalists, address[] memory defectors);
}
