// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// stakeTokens
// unStakeTokens
// issueTokens
// addAllowedTokens
// getEthValue

import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFarm is Ownable {
  address[] public allowedTokens;

  function stakeTokens(uint256 _amount, address _token) public {
    require(_amount > 0, "Amount must be more than zero.");
    require(tokenIsAllowed(_token), "Token is not currently allowed.");
  }

  function addAllowedTokens(address _token) public onlyOwner {
    allowedTokens.push(_token);
  }

  function tokenIsAllowed(address _token) public view returns (bool) {
    for(uint256 i=0; i < allowedTokens.length; i++) {
      if (allowedTokens[i] == _token) {
        return true;
      }
    }
    return false;
  }
}
