pragma solidity >=0.4.22 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DaiContract is ERC20Mintable, Ownable {}