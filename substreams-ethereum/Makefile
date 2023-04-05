# START_BLOCK ?= 16342313  # 16375000	
# START_BLOCK ?= 16420916	
# START_BLOCK ?= 16341067 +2 => collections
# START_BLOCK ?= 16426110 +2 => mint

include ../.env
include .env

export SUBSTREAMS_API_TOKEN := ${SUBSTREAMS_API_TOKEN}

.PHONY: build
build:
	cargo build --target wasm32-unknown-unknown --release

.PHONY: protogen
protogen:
	substreams protogen ./substreams.yaml --exclude-paths="sf/substreams,google"

.PHONY: stream
stream: build
	substreams run -e $(FIREHOSE_ENDPOINT) substreams.yaml txns_out --debug-modules-output=block_to_items,txns_out -s $(START_BLOCK) -t $(STOP_BLOCK)

.PHONY: pack
pack: build
	substreams pack substreams.yaml