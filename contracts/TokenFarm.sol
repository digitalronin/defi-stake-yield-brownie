// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// unStakeTokens
// getEthValue

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
  address[] public allowedTokens;
  address[] public stakers;
  mapping(address => uint256) public uniqueTokensStaked;
  mapping(address => mapping(address => uint256)) public stakingBalance;
  mapping(address => address) public tokenPriceFeedMapping;
  IERC20 public rewardToken;

  constructor(address _rewardTokenAddress) public {
    rewardToken = IERC20(_rewardTokenAddress);
  }


  // Admin functions ---------

  function addAllowedTokens(address _token) external onlyOwner {
    allowedTokens.push(_token);
  }

  function issueTokens() external onlyOwner {
    for (uint256 i = 0; i < stakers.length; i++) {
      address user = stakers[i];
      uint256 rewardValue = getTotalUsdStakedValue(user);
      // Transfer 1 reward token for every USD of staked value
      if (rewardValue > 0) {
        rewardToken.transfer(user, rewardValue);
      }
    }
  }

  function setPriceFeedAddress(address _token, address _priceFeed) external onlyOwner {
    tokenPriceFeedMapping[_token] = _priceFeed;
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

  function getTotalUsdStakedValue(address _user) public view returns (uint256) {
    if (uniqueTokensStaked[_user] <= 0) {
      return 0;
    }
    uint256 stakedUsdValue = 0;
    for (uint256 i; i < allowedTokens.length; i++) {
      stakedUsdValue += getStakedUsdValue(_user, allowedTokens[i]);
    }
    return stakedUsdValue;
  }

  function getStakedUsdValue(address _user, address _token) public view returns (uint256) {
    uint256 stakedBalance = stakingBalance[_token][_user];
    (uint256 price, uint256 decimals) = getTokenUsdPrice(_token);
    return stakedBalance * price / 10**decimals;
  }

  function getTokenUsdPrice(address _token) public view returns (uint256, uint256) {
    address priceFeedAddress = tokenPriceFeedMapping[_token];
    AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
    (, int256 price,,,) = priceFeed.latestRoundData();
    uint256 decimals = uint256(priceFeed.decimals());
    return (uint256(price), decimals);
  }


  // Internal functions

  function updateUniqueTokensStaked(address _user, address _token) internal {
    if (stakingBalance[_token][_user] <= 0) {
      uniqueTokensStaked[_user] += 1;
    }
  }
}
