from brownie import (
    network,
    config,
    accounts,
    Contract,
    MockDAI,
    MockERC20,
    MockWETH,
    MockV3Aggregator,
)

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local", "ganache-ui"]

contract_to_mock = {
    "weth_token": MockDAI,
    "fau_token": MockWETH,
    "dai_usd_price_feed": MockV3Aggregator,
    "eth_usd_price_feed": MockV3Aggregator,
}


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


def get_contract(contract_name):
    """
    Grab contract addresses from brownie-config if defined, or deploy a mock
    version of that contract and return it.

        Args:
            contract_name (string)

        Returns:
            brownie.network.contract.ProjectContract: The most recently
            deployed version of this contract.

    """
    contract_type = contract_to_mock[contract_name]
    net_name = network.show_active()
    ntwrk = config["networks"][net_name]

    if net_name in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = ntwrk[contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks():
    account = get_account()
    weth = MockWETH.deploy({"from": account})
    print(f"Deployed mock WETH contract: {weth.address}")
    erc20 = MockERC20.deploy({"from": account})
    print(f"Deployed mock ERC20 contract: {erc20.address}")
    erc20 = MockERC20.deploy({"from": account})
    fau = MockDAI.deploy({"from": account})
    print(f"Deployed mock FAU contract: {fau.address}")
    pf = MockV3Aggregator.deploy(8, 2000 * 10**8, {"from": account})
    print(f"Deployed mock Price Feed contract: {pf.address}")
