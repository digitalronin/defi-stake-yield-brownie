start-local-blockchain:
	rm -rf ./.chain-db || true
	ganache-cli \
		--account_keys_path ./.ganache-accounts.json \
		--deterministic --mnemonic brownie \
		--db ./.chain-db \
		--host 127.0.0.1 \
		--port 8545

deploy-local:
	brownie run scripts/deploy.py
