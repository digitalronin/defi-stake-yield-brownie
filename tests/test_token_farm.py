from brownie import TokenFarm, DappToken, exceptions
from scripts.utils import get_account
import pytest


def deployAndApprove():
    account = get_account()
    dapp = DappToken.deploy({"from": account})
    tf = TokenFarm.deploy({"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account})
    dapp.approve(tf.address, dapp.totalSupply(), {"from": account})
    return (account, dapp, tf)


def test_no_tokens_allowed():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    assert(not tf.tokenIsAllowed(dapp.address))


def test_only_owner_can_add_allowed_tokens():
    account, dapp, tf = deployAndApprove()
    non_owner = get_account(index=1)
    with pytest.raises(exceptions.VirtualMachineError):
        tf.addAllowedTokens(dapp.address, {"from": non_owner})


def test_add_allowed_tokens():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account}).wait(1)
    assert(tf.tokenIsAllowed(dapp.address))


def test_cannot_stake_zero_tokens():
    account, dapp, tf = deployAndApprove()
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(0, dapp.address, {"from": account})


def test_cannot_stake_tokens_which_are_not_allowed():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(100, dapp.address, {"from": account})


def test_cannot_stake_tokens_without_allowance():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account}).wait(1)
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
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account}).wait(1)
    dapp.approve(tf.address, 100, {"from": account}).wait(1)
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


def xtest_add_to_stakers_array():  # TODO
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

