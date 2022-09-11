// SPDX-License-Identifier: UNLICENSED
/// @title Crypto Tap Token Swap
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './interfaces/ICustody.sol';

// Uncomment this line to use console.log
import 'hardhat/console.sol';

contract CryptoTapTokenSwap is AccessControl, Pausable, ReentrancyGuard {
  // Address of the ERC20 $CTT token
  address public cttTokenAddress;
  // Address of the ERC20 $BRZ token
  address public brzTokenAddress;
  // Address of the Custody Contract
  address public custodyAddress;
  // uint256 public CTTPrice;

  // Roles allowed in this contract
  bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

  // TokenBuy event structure
  event TokenBuy(uint256 indexed userId, uint256 indexed amount);
  // TokenBurn event structure
  event TokenBurn(uint256 indexed userId, uint256 indexed amount);

  // Projects map
  // mapping(uint256 => IProject.ProjectData) public projects;

  // Setup admin role and transfer ownership to the same address
  constructor(
    address _adminAddress,
    address _cttTokenAddress,
    address _brzTokenAddress,
    address _custodyAddress
  ) {
    _setupRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    _setupRole(OPERATOR_ROLE, _adminAddress);
    cttTokenAddress = _cttTokenAddress;
    brzTokenAddress = _brzTokenAddress;
    custodyAddress = _custodyAddress;
  }

  function buyCTT(uint256 _userId, uint256 _amount)
    public
    payable
    onlyRole(OPERATOR_ROLE)
    nonReentrant
  {
    uint256 cttBalance = IERC20(cttTokenAddress).balanceOf(address(this));

    require(cttBalance >= _amount, 'Not enought $CTT');
    emit TokenBuy(_userId, _amount);

    IERC20(brzTokenAddress).transferFrom(msg.sender, address(this), _amount);
    IERC20(cttTokenAddress).approve(custodyAddress, _amount);
    ICustody(custodyAddress).registryInvestment(_userId, _amount);
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
