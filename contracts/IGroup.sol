pragma solidity >=0.4.0 < 0.7.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';

import './LiquidityLock.sol';

/**
 * @author blOX Consulting LLC
 * Date: 08.26.2019
 * Interface for Group Insurance Contract
 */
contract IGroup {

    using SafeMath for uint;

    event Started();
    event Stopped();
    event PeriodEnded(uint _period);
    event LiquidityWithdrawn(uint _value);
    event Loaned(uint _debt, uint _mbp);
    event PolicyholderAdded(address _policyholder);
    event PolicyholderRemoved(address _policyholder);
    event SubgroupChange(address _policyholder, uint _oldSubgroup);
    event Paid(address _policyholder, uint _period);
    event ClaimSubmitted(address _claimant, uint _period);
    event Defected(address _defector, uint _period);
    event ClaimStripped(address _claimant, uint _period);
    event ClaimPaid(address _claimant, uint _payout);
    
    enum subperiod {LOBBY, PRE, ACTIVE, POST, ENDED}
    
    mapping(address => uint) policyholders;
    mapping(uint => uint) subgroupCounts;
    mapping(uint => uint) participantIndices;
    mapping(uint => uint) claimIndices;
    mapping(uint => uint) claimPools;

    mapping(uint => mapping(uint => uint)) periodLocks;
    mapping(uint => mapping(uint => uint)) defectionCounts;
    mapping(uint => mapping(uint => bool)) toxicSubgroups;
    mapping(uint => mapping(uint => address)) participants;
    mapping(uint => mapping(address => uint)) participantToIndex;
    mapping(uint => mapping(uint => address)) claims;
    mapping(uint => mapping(address => uint)) claimants;

    bool next;
    address secretary;
    uint volume;
    uint payout;
    uint loanDebt;
    uint loanMonths;
    uint currentPeriod;
    uint origin;
    uint groupSize;
    uint subgroupIndex;

    uint[4] SUBPERIOD_DAYS = [0, 3, 33, 36];
    uint constant DEFECTION_THRESHOLD = 2;

    IERC20 Dai;
    LiquidityLock Liquidity;

    ///MUTABLE FUNCTIONS///

    /**
     * @dev modifier onlySecretary, onlyLobby
     * Exit the lobby and begin cycling through periods
     */
    function startGroup() public;

    /**
     * @dev modifier onlySecretary
     * Stop a Group from advancing to the next Period
     * @dev will only work on days 3-30
     */
    function stopGroup() public;

    /**
     *@dev modifier onlySecretary (soon to be admin)
     */
    function endPeriod(uint _period) public;

    /**
     * @dev modifier onlySecretary, liquidityLock
     * Withdraw all Dai in the liquidity contract to the Secretary account address
     */
    function withdraw() public;

    /**
     * @dev onlyPrimary
     * Give a new loan to the Group contract
     * @param _debt Dai value given to the Secretary by the Insurance Service
     * @param _months uint number of months to repay loan to underwriter
     */
    function makeLoan(uint _debt, uint _months) public;

    /**
     * @dev modifier onlySecretary, onlyLobby
     * Add a Policyholder to the group
     * @param _to the address of the Policyholder being added
     * @param _subgroup the subgroup they are to be added to
     **/
    function addPolicyholder(address _to, uint _subgroup) public;
    
    /**
     * @dev modifier onlySecretary, onlyLobby
     * Remove a Policyholder from the group
     * @param _from the address of the Policyholder being removed
     **/
    function removePolicyholder(address _from) public;
    
    /**
     * modifier onlySecretary, onlyLobby
     * Change the subgroup of a given policyholder
     * @param _policyholder the address of the policyholder switching groups
     * @param _subgroup the subgroup being switched to
     **/
    function changeSubgroup(address _policyholder, uint _subgroup) public;

    /**
     * @dev modifier onlyPolicyholder, allowed()
     * Make a payment to participate in a period's insurance contract
     * Includes premium, overpayment, and loan repayment
     * @param _period the period number to make payment for
     */
    function makePayment(uint _period) public;

    /**
     * @dev modifier onlySecretary, allowed()
     * Submit a new claim
     * @param _period uint period under which claim will be submitted
     * @param _claimant address of policyholder making claim
     */
    function submitClaim(uint _period, address _claimant) public;

    /**
     * @dev modifier onlyPolicyholder, allowed()
     * Defect from an insurance group during a given period
     * @param _period the period of the group being defected from
     */
    function defect(uint _period) public;

    ///VIEWABLE FUNCTIONS///

    /**
     * Determine whether the current group is in the lobby
     * @return true if the current active period is Lobby, and false otherwise
     */
    function isLobby() public view returns (bool);

    /**
     * Determine whether the Group is scheduled to start the next Period
     * @return true if the next flag is up, and false otherwise
     */
    function doNext() public view returns (bool);

    /**
     * Return the address of the Group Contract's secretary role
     * @return address of Secretary
     */
    function getSecretary() public view returns (address);

    /**
     * Determine the address of the Group Contract's liquidity address
     * @return address of Liquidity Lock contract
     */
    function getLiquidity() public view returns (address);

    /**
     * Determine whether the liquidity contract can be withdrawn from currently
     * @return true if the liquidity contract can be emptied, and false otherwise
     */
    function withdrawable() public view returns (bool);

    /**
     * Get the index of the currently active period
     * @return uint period index returning subperiod of ACTIVE
     */
    function activePeriod() public view returns (uint);

    /**
     * Given a period, determine its given subperiod.
     * @param _period uint index of Period being queried for subperiod state
     * @return uint the integer representation of the subperiod
     */
    function getSubperiod(uint _period) public view returns (uint currentSubperiod);

    /**
     * Determine whether the group is currently paying back a loan
     * @return true if a loan was previously issued to the group, and false otherwise
     */
    function loaned() public view returns (bool);

    /**
     * Return the total payment required of a policyholder
     * @param _query address of policyholder making payment
     * @return uint value of Dai required to make payment
     */
    function calculatePayment(address _query) public view returns (uint);

    /**
     * Determine the base premium for a period's insurance contract
     * @return uint value in Dai paid to cover claim payouts
     */
    function calculatePremium() public view returns (uint);

    /**
     * Determine the overpayment necessary for a subgroup's members
     * @param _size uint size of subgroup
     * @return uint value in Dai paid to cover cost of defection
     */
    function calculateOverpayment(uint _size) public view returns (uint);

    /**
     * Determine the loan repayment necessary to repay administration
     * @return uint value in Dai paid to administration for initial loan given
     */
    function calculateLoanPayment() public view returns (uint);

    /**
     * Determine the expected payout for a period given claim volume and Dai pot
     * @param _period uint index of period being queried
     * @return uint value in Dai paid to each claimant
     */
    function calculateExpectedPayout(uint _period) public view returns (uint);

    /**
     * Determine the Dai value of an endowment loaned to this Group
     * This is a BASIC estimator and should be revisited before production
     * @dev assumption: subgroup size of 5
     * @dev assumption: group size of 75
     * @param _months uint number of months to repay a Loan
     * @return _endowment uint the value of Dai required to make a Loan
     */
    function calculateEndowment(uint _months) public view returns (uint _endowment);

    /**
     * Determine the current status of the Group's Loan
     * @return _debt uint value of Dai still owed to the Insurance Service
     * @return _months uint number of months left to repay loan
     */
    function viewLoan() public view returns (uint _debt, uint _months);

    /**
     * Determine the liquidity in a given Period's Dai Pool
     * @param _period uint index of period being viewed
     * @return _pool uint value of Dai stored during that Period
     */
    function viewPool(uint _period) public view returns (uint _pool);

    /**
     * Determine whether a specified address is a policyholder in this Group
     * @param _query address being queried for policyholder role
     * @return _subgroup uint subgroup index of policyholder; returns 0 if not policyholder
     */
    function isPolicyholder(address _query) public view returns (uint _subgroup);

    /**
     * Return the number of policyholders in this Group
     * @return _size uint policyholders index
     */
    function getSize() public view returns (uint _size);

    /**
     * Determine the number of policyholders within a given subgroup
     * @param _index uint index of subgroup being queried
     * @return _size uint subgroup size
     */
    function getSubgroupSize(uint _index) public view returns (uint _size);

    /**
     * Determine whether an address is a participant in a specified Period
     * @param _period uint Insurance Period being queried
     * @param _query address being checked for role of participant
     * @return _index uint index in participants mapping; 0 if not participant
     */
    function isParticipant(uint _period, address _query) public view returns (uint _index);

    /**
     * Determine the participant index in a given period
     * @param _period uint index of period being queried
     * @return _index uint number of participants in period
     */
    function activeIndex(uint _period) public view returns (uint _index);

    /**
     * Determine the participant address associated with a specific index in a given Period
     * @param _period uint Insurance Period index
     * @param _index uint participant index being queried
     * @return _participant address of participant stored at the given index; returns 0 if null
     */
    function indexToParticipant(uint _period, uint _index) public view returns (address _participant);

    /**
     * Determine whether an address is a claimant in a specified Period
     * @param _period uint Insurance Period being queried
     * @param _query address being checked for role of claimant
     * @return _index uint index in claimant mapping; 0 if not claimant
     */
    function isClaimant(uint _period, address _query) public view returns (uint _index);

    /**
     * Determine the claim index in a given Period
     * @param _period uint index of period being queried
     * @return _index uint number of Claims opened during the Period
     */
    function claimIndex(uint _period) public view returns (uint _index);

    /**
     * Determine the claimant address associated with a specific index in a given Period
     * @param _period Insurance Period index
     * @param _index uint claim index being queried
     * @return _claimant address of claimant stored at the given index; returns 0 if null
     */
    function indexToClaimant(uint _period, uint _index) public view returns (address _claimant);

    /**
     * Determine the defection count of a subgroup during a period
     * @param _period uint index of Period being queried for defections
     * @param _subgroup uint index of Subgroup being queried for defections
     * @return _count uint number of defectors in the subgroup during the specified period
     */
    function getDefectionCount(uint _period, uint _subgroup) public view returns (uint _count);
}