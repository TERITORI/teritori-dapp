ADMIN_TESTNET=testnet-adm
ADMIN_ADDR_TESTNET=$(shell teritorid keys show $(ADMIN_TESTNET) --keyring-backend test --output json | jq -r .address)
NODE_FLAG_TESTNET=--node https://rpc.testnet.teritori.com:443
TX_FLAGS_TESTNET=--from $(ADMIN_TESTNET) --chain-id teritori-test-7 $(NODE_FLAG_TESTNET) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS_TESTNET=$(NODE_FLAG_TESTNET) -o json
CODE_ID_TESTNET=71
CONFIG_TESTNET=$(shell cat config.json | jq -r '.owner="$(ADMIN_ADDR_TESTNET)" | tojson | @sh')

ADMIN_MAINNET=mainnet-adm
ADMIN_ADDR_MAINNET=$(shell teritorid keys show $(ADMIN_MAINNET) --output json | jq -r .address)
NODE_FLAG_MAINNET=--node https://rpc.mainnet.teritori.com:443
# --keyring-backend os by default
TX_FLAGS_MAINNET=--from $(ADMIN_MAINNET) --chain-id teritori-1 $(NODE_FLAG_MAINNET) --gas auto --gas-adjustment 1.3 -y -b sync --output json -o json
QUERY_FLAGS_MAINNET=$(NODE_FLAG_MAINNET) -o json
CODE_ID_MAINNET=
CONFIG_MAINNET=$(shell cat config-mainnet.json | jq -r '.owner="$(ADMIN_ADDR_MAINNET)" | tojson | @sh')

WORKSPACE_PATH := $(shell realpath $(shell dirname $(shell pwd))/../..)

# only informative
# CONTRACT_ADDRESS_TESTNET=tori1te7ku4de0k4rl8lhyuvpmhygaq7k7vy5zpsjq9y638efxsnx3aaqck2utf
# CONTRACT_ADDRESS_MAINNET=

.PHONY: artifacts/nft_launchpad.wasm
artifacts/nft_launchpad.wasm:
		docker run --rm -v "$(WORKSPACE_PATH):/code" \
		--platform linux/amd64 \
		--mount type=volume,source=nft_launchpad_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/nft_launchpad.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store $(WORKSPACE_PATH)/artifacts/nft_launchpad.wasm $(TX_FLAGS_TESTNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_TESTNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.testnet
instantiate.testnet: config.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID_TESTNET) $(CONFIG_TESTNET) --label NftLaunchpad --admin $(ADMIN_ADDR_TESTNET) $(TX_FLAGS_TESTNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_TESTNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done

.PHONY: deploy.mainnet
deploy.mainnet: artifacts/nft_launchpad.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store $(WORKSPACE_PATH)/artifacts/nft_launchpad.wasm $(TX_FLAGS_MAINNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_MAINNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.mainnet
instantiate.mainnet: config-mainnet.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID_MAINNET) $(CONFIG_MAINNET) --label NftsBurner --admin $(ADMIN_ADDR_MAINNET) $(TX_FLAGS_MAINNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_MAINNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done