pragma solidity >= 0.4.0 < 0.7.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

/**
 * @author blOX Consulting
 * Date: 8.26.19
 * 
 * ERC20 Placeholder for Dai in TandaPay Demonstration
 * @dev Literally ERC20Mintable
 **/
contract DaiContract is ERC20Mintable {
    string private _name = "TandaPay Dai Placeholder";
    string private _symbol = "TPDAI";

    /**
     * Get the name of the ERC20 token.
     * @return string name
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * Get the ERC20 token symbol
     * @return string symbol
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }
}