ADMIN=testnet-adm
ADMIN_ADDR=$(shell teritorid keys show $(ADMIN) --keyring-backend test --output json | jq -r .address)
NODE_FLAG=--node https://rpc.testnet.teritori.com:443
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-6 $(NODE_FLAG) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS=$(NODE_FLAG) -o json
CODE_ID=52
CONFIG=$(shell cat config.json | jq --rawfile desc desc.txt -r '.admin_addr="$(ADMIN_ADDR)" | .description=$$desc | tojson | @sh')

# only informative
CONTRACT_ADDRESS=tori16w7h5tkkjtr36rpcdg8qv4sfs2e44xcrz6a9eczcslywyfpsynfqyj5pt0

.PHONY: artifacts/nft_marketplace.wasm
artifacts/nft_marketplace.wasm:
	docker run --rm -v "$(PWD)":/code \
		--platform linux/amd64 \
		--mount type=volume,source=nft_marketplace_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/nft_marketplace.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store artifacts/nft_marketplace.wasm $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.testnet
instantiate.testnet: config.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID) $(CONFIG) --label Cw721Membership --admin $(ADMIN_ADDR) $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done
