ADMIN=testnet-adm
ADMIN_ADDR=$(shell teritorid keys show $(ADMIN) --keyring-backend test --output json | jq -r .address)
NODE_FLAG=--node https://rpc.testnet.teritori.com:443
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-7 $(NODE_FLAG) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS=$(NODE_FLAG) -o json
CODE_ID=15
CONFIG=$(shell cat config.json | jq -r '.admin_addr="$(ADMIN_ADDR)" | tojson | @sh')

ADMIN_MAINNET=collections-adm
ADMIN_ADDR_MAINNET=$(shell teritorid keys show $(ADMIN_MAINNET) --output json | jq -r .address)
NODE_FLAG_MAINNET=--node https://rpc.mainnet.teritori.com:443
TX_FLAGS_MAINNET=--from $(ADMIN_MAINNET) --chain-id teritori-1 $(NODE_FLAG_MAINNET) --gas auto --gas-adjustment 1.3 -y -b sync --output json -o json
QUERY_FLAGS_MAINNET=$(NODE_FLAG_MAINNET) -o json
CODE_ID_MAINNET=38
CONFIG_MAINNET=$(shell cat config-mainnet.json | jq -r '.admin_addr="$(ADMIN_ADDR_MAINNET)" | tojson | @sh')

# only informative
CONTRACT_ADDRESS=tori1k95lcrdzamyeu882dtuclrzqmv6ay0axfa3wng8jla0ty52tzn4q4r40yx
CONTRACT_ADDRESS_MAINNET=tori16tlfw7uq73d5n8j5tl0zl367c58f032j50jgxr3e7f09gez3xq5qvcrxy7

.PHONY: artifacts/nfts_burner.wasm
artifacts/nfts_burner.wasm:
	docker run --rm -v "$(PWD)":/code \
		--platform linux/amd64 \
		--mount type=volume,source=nfts_burner_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/nfts_burner.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store artifacts/nfts_burner.wasm $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: deploy.mainnet
deploy.mainnet: artifacts/nfts_burner.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store artifacts/nfts_burner.wasm $(TX_FLAGS_MAINNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_MAINNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.testnet
instantiate.testnet: config.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID) $(CONFIG) --label NftsBurner --admin $(ADMIN_ADDR) $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done

.PHONY: instantiate.mainnet
instantiate.mainnet: config-mainnet.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID_MAINNET) $(CONFIG_MAINNET) --label NftsBurner --admin $(ADMIN_ADDR_MAINNET) $(TX_FLAGS_MAINNET) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS_MAINNET) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done
