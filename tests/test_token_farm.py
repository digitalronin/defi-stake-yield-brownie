from brownie import (
    TokenFarm, DappToken, MockV3Aggregator, exceptions
)
from scripts.utils import get_account
import pytest


def deployAndApprove():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account})
    dapp.approve(tf.address, dapp.totalSupply(), {"from": account})
    return (account, dapp, tf)


def test_no_tokens_allowed():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    assert(not tf.tokenIsAllowed(dapp.address))


def test_only_owner_can_add_allowed_tokens():
    account, dapp, tf = deployAndApprove()
    non_owner = get_account(index=1)
    with pytest.raises(exceptions.VirtualMachineError):
        tf.addAllowedTokens(dapp.address, {"from": non_owner})


def test_add_allowed_tokens():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account})
    assert(tf.tokenIsAllowed(dapp.address))


def test_cannot_stake_zero_tokens():
    account, dapp, tf = deployAndApprove()
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(0, dapp.address, {"from": account})


def test_cannot_stake_tokens_which_are_not_allowed():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(100, dapp.address, {"from": account})


def test_cannot_stake_tokens_without_allowance():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(100000, dapp.address, {"from": account})


def test_cannot_stake_more_than_token_balance():
    account, dapp, tf = deployAndApprove()
    account2 = get_account(index=1)
    dapp.transfer(account2, dapp.balanceOf(account), {"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(100000, dapp.address, {"from": account})


def test_cannot_stake_more_than_token_allowance():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy(dapp.address, {"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account})
    dapp.approve(tf.address, 100, {"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(100000, dapp.address, {"from": account})


def test_staking_transfers_tokens():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    balance = dapp.balanceOf(account)
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(dapp.balanceOf(account) == balance - amount)


def test_staking_sets_staking_balance():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(tf.stakingBalance(dapp.address, account.address) == amount)


def test_staking_increases_staking_balance():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(tf.stakingBalance(dapp.address, account.address) == amount * 2)


def test_staking_updates_unique_tokens_count():
    account, dapp, tf = deployAndApprove()
    assert(tf.uniqueTokensStaked(account.address) == 0)
    tf.stakeTokens(1000, dapp.address, {"from": account})
    assert(tf.uniqueTokensStaked(account.address) == 1)


def test_staking_same_token_twice_does_not_change_unique_tokens_count():
    account, dapp, tf = deployAndApprove()
    assert(tf.uniqueTokensStaked(account.address) == 0)
    tf.stakeTokens(1000, dapp.address, {"from": account})
    tf.stakeTokens(1000, dapp.address, {"from": account})
    assert(tf.uniqueTokensStaked(account.address) == 1)


def test_staking_different_token_changes_unique_tokens_count():
    account, dapp, tf = deployAndApprove()

    token2 = DappToken.deploy({"from": account})
    token2.approve(tf.address, token2.totalSupply(), {"from": account})
    tf.addAllowedTokens(token2.address, {"from": account})

    tf.stakeTokens(1000, dapp.address, {"from": account})
    tf.stakeTokens(1000, token2.address, {"from": account})
    assert(tf.uniqueTokensStaked(account.address) == 2)


def test_starts_with_no_stakers():
    account, dapp, tf = deployAndApprove()
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakers(0)


def test_add_to_stakers_array():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(tf.stakers(0) == account.address)


def xtest_dont_add_duplicates_to_stakers_array():  # TODO
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    tf.stakeTokens(amount, dapp.address, {"from": account})
    # stake twice, but only add to stakers once
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakers(1)


def test_only_owner_can_call_issuetokens():
    account, dapp, tf = deployAndApprove()
    non_owner = get_account(index=1)
    with pytest.raises(exceptions.VirtualMachineError):
        tf.issueTokens({"from": non_owner})


def test_non_stakers_have_zero_usd_value_staked():
    account, dapp, tf = deployAndApprove()
    assert(0 == tf.getTotalUsdStakedValue(account))


def test_only_owner_can_set_price_feed_address():
    account, dapp, tf = deployAndApprove()
    non_owner = get_account(index=1)
    with pytest.raises(exceptions.VirtualMachineError):
        tf.setPriceFeedAddress(dapp.address, dapp.address, {"from": non_owner})


def test_set_price_feed_address():
    account, dapp, tf = deployAndApprove()
    dummy_address = get_account(index=1).address
    tf.setPriceFeedAddress(dapp.address, dummy_address, {"from": account})
    assert(tf.tokenPriceFeedMapping(dapp.address) == dummy_address)


# This checks that we are calling the price feed contract
def test_get_token_usd_price():
    account, dapp, tf = deployAndApprove()
    priceFeed = MockV3Aggregator.deploy(8, 2000 * 10**8, {"from": account})
    tf.setPriceFeedAddress(dapp.address, priceFeed.address, {"from": account})
    price, decimals = tf.getTokenUsdPrice(dapp.address)
    assert(decimals == 8)
    assert(price == 2000 * 10**8)


def test_get_total_usd_staked_value():
    account, token1, tf = deployAndApprove()

    token2 = DappToken.deploy({"from": account})
    token2.approve(tf.address, token2.totalSupply(), {"from": account})
    tf.addAllowedTokens(token2.address, {"from": account})

    pf1 = MockV3Aggregator.deploy(8, 2000 * 10**8, {"from": account})
    tf.setPriceFeedAddress(token1.address, pf1.address, {"from": account})

    pf2 = MockV3Aggregator.deploy(18, 5 * 10**18, {"from": account})
    tf.setPriceFeedAddress(token2.address, pf2.address, {"from": account})

    tf.stakeTokens(1000, token1.address, {"from": account})
    tf.stakeTokens(300, token2.address, {"from": account})

    value = tf.getTotalUsdStakedValue(account.address)
    assert(value == (1000 * 2000) + (300 * 5))


def test_issue_tokens_transfers_dapp_to_user():
    account, dapp, tf = deployAndApprove()

    # Add some reward funds to the farm
    dapp.transfer(tf.address, 50_000, {"from": account})

    # Set price to $1/DAPP
    priceFeed = MockV3Aggregator.deploy(8, 1 * 10**8, {"from": account})
    tf.setPriceFeedAddress(dapp.address, priceFeed.address, {"from": account})

    # Setup a 2nd account - this will be our staker
    account2 = get_account(index=1)
    dapp.transfer(account2.address, 10_000)
    dapp.approve(tf.address, 100_000, {"from": account2})

    # Stake 1,000 DAPP
    tf.stakeTokens(1_000, dapp.address, {"from": account2})

    staker_balance = dapp.balanceOf(account2)
    farm_balance = dapp.balanceOf(tf)

    tf.issueTokens({"from": account})

    # Staked $1,000 so reward is 1000 DAPP
    assert(dapp.balanceOf(account2) == staker_balance + 1_000)
    assert(dapp.balanceOf(tf) == farm_balance - 1_000)


def test_unstaking_before_staking_raises_error():
    account, dapp, tf = deployAndApprove()
    with pytest.raises(exceptions.VirtualMachineError):
        tf.unstakeTokens(dapp.address, {"from": account})


def test_unstaking_transfers_tokens_to_user():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    balance = dapp.balanceOf(account)
    tf.unstakeTokens(dapp.address, {"from": account})
    assert(balance + amount == dapp.balanceOf(account))


def test_unstaking_resets_staking_balance():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(1000 == tf.stakingBalance(dapp.address, account))
    tf.unstakeTokens(dapp.address, {"from": account})
    assert(0 == tf.stakingBalance(dapp.address, account))


def test_unstaking_reduces_unique_tokens_count():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(tf.uniqueTokensStaked(account.address) == 1)
    tf.unstakeTokens(dapp.address, {"from": account})
    assert(tf.uniqueTokensStaked(account.address) == 0)


def test_unstaking_last_token_type_removes_user_from_stakers_array():
    account, dapp, tf = deployAndApprove()
    amount = 1000
    tf.stakeTokens(amount, dapp.address, {"from": account})
    assert(tf.numberOfStakers() == 1)
    tf.unstakeTokens(dapp.address, {"from": account})
    assert(tf.numberOfStakers() == 0)


def test_unstaking_does_not_remove_multitoken_user_from_stakers_array():
    account, dapp, tf = deployAndApprove()

    token2 = DappToken.deploy({"from": account})
    token2.approve(tf.address, token2.totalSupply(), {"from": account})
    tf.addAllowedTokens(token2.address, {"from": account})

    tf.stakeTokens(1000, dapp.address, {"from": account})
    tf.stakeTokens(1000, token2.address, {"from": account})

    assert(tf.numberOfStakers() == 1)
    tf.unstakeTokens(dapp.address, {"from": account})
    assert(tf.numberOfStakers() == 1)
