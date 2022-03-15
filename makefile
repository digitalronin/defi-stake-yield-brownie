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

serve:
	cd frontend; yarn start

build-frontend:
	cd frontend; \
	yarn build

commit-built-frontend:
	git checkout deploy
	git add -u frontend/build  # Remove any deleted build files
	find frontend/build/ | xargs git add -f  # Sometimes files are skipped if we just `git add -f frontend/build` - this should be more reliable
	git commit -m "Commit updated frontend/build"
