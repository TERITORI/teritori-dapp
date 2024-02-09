CODE_ID=13
ADMIN=testnet-adm
ADMIN_ADDR=$(shell teritorid keys show $(ADMIN) --keyring-backend test --output json | jq -r .address)
TX_FLAGS=--from $(ADMIN) --chain-id teritori-test-6 --node https://rpc.testnet.teritori.com:443 --gas auto --gas-adjustment 1.3 -y -b sync --output json --keyring-backend test
CONTRACT_ADDRESS=tori1yek2csaaw550wq52v06ztwp2snuxp8epkfzzvqfvkv8g6xfv3nqqzgz3p9

artifacts/cw721_membership.wasm:
	docker run --rm -v "$(PWD)":/code \
		--platform linux/amd64 \
		--mount type=volume,source=cw721_membership_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: deploy.testnet
deploy.testnet: artifacts/cw721_membership.wasm
	teritorid tx wasm store artifacts/cw721_membership.wasm $(TX_FLAGS)

.PHONY: instantiate.testnet
instantiate.testnet:
	teritorid tx wasm instantiate $(CODE_ID) '{ "admin_addr": "$(ADMIN_ADDR)", "mint_royalties": 1000 }' --label Cw721Membership --admin $(ADMIN_ADDR) $(TX_FLAGS)
