WALLET_NAME=deploy
CHAIN_ID=teritori-test-6
NODE_RPC=https://rpc.testnet.teritori.com:443
NFT_LAUNCHPAD_WASM=nft_launchpad.wasm

.PHONY: artifacts/nft_launchpad.wasm
artifacts/nft_launchpad.wasm:
	docker run --rm -v "$(PWD)":/code \
		--platform linux/amd64 \
		--mount type=volume,source=nft_launchpad_cache,target=/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		cosmwasm/rust-optimizer:0.14.0

.PHONY: store.nft_launchpad
store.nft_launchpad: 
	teritorid tx wasm store --from $(WALLET_NAME) --chain-id $(CHAIN_ID) --node $(NODE_RPC) $(NFT_LAUNCHPAD_WASM) --gas auto --gas-adjustment 1.3 -y

.PHONY: instantiate.nft_launchpad
instantiate.nft_launchpad:
	INIT='{"config":{"name":"Teritori launchpad","supported_networks":[]}}';
	teritorid tx wasm instantiate 69 "$${INIT}" --from deploy --label "NFT Launchpad" -y --no-admin;
