// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// unStakeTokens
// issueTokens
// getEthValue

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenFarm is Ownable {
  address[] public allowedTokens;
  address[] public stakers;
  mapping(address => uint256) public uniqueTokensStaked;
  mapping(address => mapping(address => uint256)) public stakingBalance;

  // Admin functions ---------

  function addAllowedTokens(address _token) external onlyOwner {
    allowedTokens.push(_token);
  }

  // User functions ---------

  function stakeTokens(uint256 _amount, address _token) external {
    require(_amount > 0, "Amount must be more than zero.");
    require(tokenIsAllowed(_token), "Token is not currently allowed.");
    IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    updateUniqueTokensStaked(msg.sender, _token);
    stakingBalance[_token][msg.sender] += _amount;
    if (uniqueTokensStaked[msg.sender] == 1) {  // First time staking
      stakers.push(msg.sender);
    }
  }

  function tokenIsAllowed(address _token) public view returns (bool) {
    for(uint256 i=0; i < allowedTokens.length; i++) {
      if (allowedTokens[i] == _token) {
        return true;
      }
    }
    return false;
  }

  // Internal functions

  function updateUniqueTokensStaked(address _user, address _token) internal {
    if (stakingBalance[_token][_user] <= 0) {
      uniqueTokensStaked[_user] += 1;
    }
  }
}
