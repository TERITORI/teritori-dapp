ADMIN=testnet-adm
ADMIN_ADDR=$(shell teritorid keys show $(ADMIN) --keyring-backend test --output json | jq -r .address)
NODE_FLAG=--node https://rpc.testnet.teritori.com:443
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-6 $(NODE_FLAG) --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test -o json
QUERY_FLAGS=$(NODE_FLAG) -o json
CODE_ID=50
CONFIG=$(shell cat config.json | jq --rawfile desc desc.txt -r '.admin_addr="$(ADMIN_ADDR)" | .description=$$desc | tojson | @sh')

# only informative
CONTRACT_ADDRESS=tori1922wa7883ftymh47cxxjyun293et400pl8fy6ugkr9602zu7eccqzl4ufk

.PHONY: artifacts/cw721_membership.wasm
artifacts/cw721_membership.wasm:
	docker run --rm -v "$(PWD)":/code \
		--platform linux/amd64 \
		--mount type=volume,source=cw721_membership_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/cw721_membership.wasm
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm store artifacts/cw721_membership.wasm $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value'; do sleep 1; done

.PHONY: instantiate.testnet
instantiate.testnet: config.json
	set -o pipefail; \
	TXHASH=$$(teritorid tx wasm instantiate $(CODE_ID) $(CONFIG) --label Cw721Membership --admin $(ADMIN_ADDR) $(TX_FLAGS) | jq -r .txhash); \
	while ! teritorid query tx $$TXHASH $(QUERY_FLAGS) 2>/dev/null | jq -r '.logs[0].events[] | select(.type=="instantiate").attributes[] | select(.key=="_contract_address").value'; do sleep 1; done
