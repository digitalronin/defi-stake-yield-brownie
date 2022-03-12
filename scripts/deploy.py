from scripts.utils import get_account, get_contract
from brownie import TokenFarm, DappToken, config, network
from web3 import Web3
import yaml
import json
import os
import shutil

RETAINED_BALANCE = Web3.toWei(1_000, "ether")


def main():
    account = get_account()
    tf, dapp_token = deploy_token_farm_and_dapp_token(account)
    fund_token_farm(tf, dapp_token, account)
    add_allowed_tokens(tf, account, dapp_token)
    update_frontend()
    return (tf, dapp_token)


def deploy_token_farm_and_dapp_token(account):
    ntwrk = config["networks"][network.show_active()]

    dapp = DappToken.deploy(
        {"from": account},
        publish_source=ntwrk.get("verify", False)
    )

    tf = TokenFarm.deploy(
        dapp.address,
        {"from": account},
        publish_source=ntwrk.get("verify", False)
    )

    return (tf, dapp)


def fund_token_farm(farm, token, account):
    token.transfer(
        farm.address,
        token.totalSupply() - RETAINED_BALANCE,
        {"from": account},
    ).wait(1)


def add_allowed_tokens(farm, account, dapp_token):
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    for token in allowed_tokens:
        farm.addAllowedTokens(token.address, {"from": account}).wait(1)
        pf = allowed_tokens[token]
        farm.setPriceFeedAddress(token.address, pf.address, {"from": account})


def update_frontend():
    copy_folders_to_frontend("./build", "./frontend/src/chain-info")
    with open("brownie-config.yaml", "r") as conf:
        config_dict = yaml.load(conf, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as jsn:
            json.dump(config_dict, jsn)
    print("Frontend updated.")


def copy_folders_to_frontend(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
