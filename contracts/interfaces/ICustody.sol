// SPDX-License-Identifier: MIT

/// @title Custody Interface
pragma solidity ^0.8.14;

interface ICustody {
  function registryInvestment(uint256 _userId, uint256 _amount) external;
}
