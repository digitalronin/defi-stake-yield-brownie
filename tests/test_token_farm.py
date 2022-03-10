from brownie import TokenFarm, DappToken, exceptions
from scripts.utils import get_account
import pytest


def test_no_tokens_allowed():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    assert(not tf.tokenIsAllowed(dapp.address))


def test_only_owner_can_add_allowed_tokens():
    owner = get_account(index=0)
    non_owner = get_account(index=1)

    tf = TokenFarm.deploy({"from": owner})
    dapp = DappToken.deploy({"from": owner})

    with pytest.raises(exceptions.VirtualMachineError):
        tf.addAllowedTokens(dapp.address, {"from": non_owner})


def test_add_allowed_tokens():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    tf.addAllowedTokens(dapp.address, {"from": account}).wait(1)
    assert(tf.tokenIsAllowed(dapp.address))


def test_can_stake_tokens():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    tf.stakeTokens(100, dapp.address, {"from": account})
    # TODO: Assert some stuff when we have more functionality


def test_cannot_stake_zero_tokens():
    account = get_account()
    tf = TokenFarm.deploy({"from": account})
    dapp = DappToken.deploy({"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        tf.stakeTokens(0, dapp.address, {"from": account})
