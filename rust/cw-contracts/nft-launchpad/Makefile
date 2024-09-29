ADMIN=testnet-adm
ADMIN_ADDR=$(shell teritorid keys show $(ADMIN) --keyring-backend test --output json | jq -r .address)
NODE_FLAG=--node https://rpc.testnet.teritori.com:443
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-7 $(NODE_FLAG) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS=$(NODE_FLAG) -o json
CODE_ID=56
CONFIG=$(shell cat config.json | jq -r '.owner="$(ADMIN_ADDR)" | tojson | @sh')
WORKSPACE_PATH := $(shell realpath $(shell dirname $(shell pwd))/../..)

# only informative
# CONTRACT_ADDRESS=tori1gjww784k65v7yjv992uv025dy0yfekrkqnch0ukj5dmg0ku90y8q2etwq8

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
	TXHASH=$$(teritorid tx wasm store $(WORKSPACE_PATH)/artifacts/nft_launchpad.wasm $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.testnet
instantiate.testnet: config.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID) $(CONFIG) --label NftLaunchpad --admin $(ADMIN_ADDR) $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done
