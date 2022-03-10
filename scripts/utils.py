from brownie import (
    network,
    config,
    accounts,
)

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local", "ganache-ui"]


def get_account(index=None, id=None):
    net_name = network.show_active()

    if index:
        account = accounts[index]
    elif id:
        account = accounts.load(id)
    elif(
        net_name in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or net_name in FORKED_LOCAL_ENVIRONMENTS
    ):
        account = accounts[0]
    else:
        account = accounts.add(config["wallets"]["from_key"])

    return account
