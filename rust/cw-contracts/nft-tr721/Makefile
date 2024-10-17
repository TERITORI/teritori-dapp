ADMIN=testnet-adm
NODE_FLAG=--node https://rpc.testnet.teritori.com:443
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-7 $(NODE_FLAG) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS=$(NODE_FLAG) -o json
WORKSPACE_PATH := $(shell realpath $(shell dirname $(shell pwd))/../..)

# only informative
# CODE_ID=0

.PHONY: artifacts/nft_tr721.wasm
artifacts/nft_tr721.wasm:
		docker run --rm -v "$(WORKSPACE_PATH):/code" \
		--platform linux/amd64 \
		--mount type=volume,source=nft_tr721_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/nft_tr721.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store $(WORKSPACE_PATH)/artifacts/nft_tr721.wasm $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done