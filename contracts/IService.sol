pragma solidity >= 0.4.0 < 0.7.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';


/**
 * @author blOX Consulting LLC
 * Date: 08.26.2019
 * Interface for Insurance Service/ Group Factory Contract
 */
contract IService {

    using SafeMath for uint;

    event AdminApproved(address _approved);
    event AdminRevoked(address _revoked);
    event GroupCreated(address _group, address _to);
    event Remitted(address _group, uint _period);
    event Loaned(address _group);

    enum subperiod {LOBBY, PRE, ACTIVE, POST, ENDED}

    mapping(address => bool) administrators;
    mapping(address => uint) secretaries;
    mapping(uint => address) groups;

    IERC20 Dai;

    uint groupCount;

    ///MUTABLE FUNCTIONS///

    /**
     * @dev modifier onlyAdmin
     * Add an admin
     * @param _to the address being whitelisted
     **/
    function addAdmin(address _to) public;

    /**
     * @dev modifier onlyAdmin
     * Remove an admin
     * @param _from the address being blacklisted
     **/
    function removeAdmin(address _from) public;

    /**
     * @dev modifier onlyAdmin
     * Approve a secretary and create a new group
     * @param _to the address being given a secretary role
     * @param _volume uint number of expected claims
     * @param _payout uint number of Dai paid per claim
     * @return _group the address of the Group contact
     **/
    function createGroup(address _to, uint _volume, uint _payout) public returns (address _group);

    /**
     * @dev modifier onlyAdmin
     * @dev modifier unlocked
     * Remit a single group assuming it is not timelocked
     * @param _group the address of the group being remitted
     **/
    function remitGroup(address _group) public;

    /**
     * @dev modifier onlyAdmin
     * @dev require sufficienct balance
     * Extend a loan, in Dai, to a Tanda Group
     * @param _group the group being given the loan
     * @param _months the length, in months (periods), the Group has to repay
     */
    function loan(address _group, uint _months) public;

    ///VIEWABLE FUNCTIONS///

    /**
     * Query an address to determine if it currently holds an Administrator role in the Service
     * @param _query address being queried as Administrator
     * @return bool true if the address is an Administrator, and false otherwise
     */
    function isAdmin(address _query) public view returns (bool);

    /**
     * Determine if an address is a Secretary by returning the index of their group
     * @param _query address being queried as Secretary
     * @return _index uint stored index of Secretary's Group; returns 0 if none
     */
    function isSecretary(address _query) public view returns (uint _index);

    /**
     * Determine the Group address stored internally at a specific index
     * @param _index uint key to return address value in mapping 'groups'
     * @return the address stored at the queried index. Returns 0x00 if none
     */
    function getGroup(uint _index) public view returns (address _group);

    /**
     * Determine the number of insurance groups deployed by this Service
     * @return _index uint number of deployed Group child contracts deployed
     */
    function getGroupCount() public view returns (uint _index);

}
