// SPDX-License-Identifier: UNLICENSED
/// @title Crypto Tap Token Swap
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Uncomment this line to use console.log
import 'hardhat/console.sol';

contract Custody is AccessControl, Pausable, ReentrancyGuard {
  // Address of the ERC20 $CTT token
  address public CttTokenAddress;
  // Address of the ERC20 $BRZ token
  address public BrzTokenAddress;

  mapping(uint256 => uint256) public balanceByUser;

  // Roles allowed in this contract
  bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

  // Invest event structure
  event Invest(uint256 indexed userId, uint256 indexed amount);
  // Withdrawal event structure
  event Withdrawal(uint256 indexed userId, uint256 indexed amount);

  // Projects map
  // mapping(uint256 => IProject.ProjectData) public projects;

  // Setup admin role and transfer ownership to the same address
  constructor(
    address _adminAddress,
    address _cttTokenAddress,
    address _brzTokenAddress
  ) {
    _setupRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    _setupRole(OPERATOR_ROLE, _adminAddress);
    CttTokenAddress = _cttTokenAddress;
    BrzTokenAddress = _brzTokenAddress;
  }

  function registryInvestment(uint256 _userId, uint256 _amount)
    external
    onlyRole(OPERATOR_ROLE)
    nonReentrant
  {
    balanceByUser[_userId] += _amount;
    IERC20(CttTokenAddress).transferFrom(msg.sender, address(this), _amount);
  }

  /**
   * @notice Pause this contract
   * @dev This function can only be called by the admin
   */
  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /**
   * @notice Unpause this contract
   * @dev This function can only be called by the admin
   */
  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }
}
