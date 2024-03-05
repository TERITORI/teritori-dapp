CANDYMACHINE_REPO=teritori-nfts
BUNKER_MINTER_PACKAGE=teritori-bunker-minter
GO?=go
GOFMT?=$(shell $(GO) env GOROOT)/bin/gofmt

COSMWASM_CONTRACTS_DIR=cosmwasm-contracts
INTERNAL_COSMWASM_CONTRACTS=$(wildcard $(COSMWASM_CONTRACTS_DIR)/*)

TOKEN_REPO=teritori-nfts
TOKEN_PACKAGE=teritori-nft
SQUAD_STAKING_PACKAGE=teritori-squad-staking
BREEDING_PACKAGE=teritori-breeding
DISTRIBUTOR_PACKAGE=teritori-distributor

NAME_SERVICE_REPO=teritori-name-service
NAME_SERVICE_PACKAGE=teritori-name-service

RIOTER_FOOTER_REPO=rioters-footer-nft
RIOTER_FOOTER_PACKAGE=rioter-footer-nft

ADDR_LIST_REPO=cw_addr_list
ADDR_LIST_PACKAGE=cw-address-list

CONTRACTS_CLIENTS_DIR=packages/contracts-clients

DOCKER_REGISTRY=rg.nl-ams.scw.cloud/teritori
INDEXER_DOCKER_IMAGE=$(DOCKER_REGISTRY)/teritori-indexer:$(shell git rev-parse --short HEAD)
FLUSH_DATA_IMAGE=$(DOCKER_REGISTRY)/flush-data:$(shell git rev-parse --short HEAD)
EVM_INDEXER_IMAGE=$(DOCKER_REGISTRY)/evm-indexer:$(shell git rev-parse --short HEAD)
BACKEND_DOCKER_IMAGE=$(DOCKER_REGISTRY)/teritori-dapp-backend:$(shell git rev-parse --short HEAD)
PRICES_SERVICE_DOCKER_IMAGE=$(DOCKER_REGISTRY)/prices-service:$(shell git rev-parse --short HEAD)
PRICES_OHLC_REFRESH_DOCKER_IMAGE=$(DOCKER_REGISTRY)/prices-ohlc-refresh:$(shell git rev-parse --short HEAD)
P2E_DOCKER_IMAGE=$(DOCKER_REGISTRY)/p2e-update-leaderboard:$(shell git rev-parse --short HEAD)
FEED_DOCKER_IMAGE=$(DOCKER_REGISTRY)/feed-clean-pinata-keys:$(shell git rev-parse --short HEAD)
MULTISIG_DOCKER_IMAGE=$(DOCKER_REGISTRY)/cosmos-multisig-backend:$(shell git rev-parse --short HEAD)


ARCH := $(shell uname -m)

ifeq ($(ARCH),x86_64)
    ARCH := amd64
else ifeq ($(ARCH),aarch64)
    ARCH := arm64
endif

node_modules: package.json yarn.lock
	yarn
	touch $@

.PHONY: go-mod-tidy
go-mod-tidy:
	go mod tidy
	cd ./weshd && go mod tidy

.PHONY: generate
generate: generate.protobuf generate.graphql generate.contracts-clients generate.go-networks networks.json

.PHONY: generate.protobuf
generate.protobuf: node_modules packages/api/weshnet
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	buf generate api

.PHONY: packages/api/weshnet
packages/api/weshnet: node_modules
	rm -fr $@
	buf generate --template ./weshnet.buf.gen.yaml buf.build/berty/weshnet -o .weshgen
	cp -r .weshgen/packages/api $@
	rm -fr .weshgen

.PHONY: generate.graphql
generate.graphql:
	go run github.com/Khan/genqlient@85e2e8dffd211c83a2be626474993ef68e44a242 go/pkg/holagql/genqlient.yaml

.PHONY: generate.graphql-thegraph
generate.graphql-thegraph:
	rover graph introspect https://api.studio.thegraph.com/query/40379/teritori-mainnet/v1 > go/pkg/thegraph/thegraph-schema.graphql
	go run github.com/Khan/genqlient@85e2e8dffd211c83a2be626474993ef68e44a242 go/pkg/thegraph/genqlient.yaml

.PHONY: lint
lint: lint.buf lint.js

.PHONY: lint.buf
lint.buf:
	buf lint api
	buf breaking --against 'https://github.com/TERITORI/teritori-dapp.git#branch=main' --path api

.PHONY: lint.js
lint.js: node_modules
	yarn lint

.PHONY: go/pkg/holagql/holaplex-schema.graphql
go/pkg/holagql/holaplex-schema.graphql:
	rover graph introspect https://graph.65.108.73.219.nip.io/v1 > $@

.PHONY: docker.backend
docker.backend:
	docker build . -f go/cmd/teritori-dapp-backend/Dockerfile -t teritori/teritori-dapp-backend:$(shell git rev-parse --short HEAD)

.PHONY: generate.contracts-clients
generate.contracts-clients: generate.internal-contracts-clients $(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(TOKEN_PACKAGE)

.PHONY: generate.go-networks
generate.go-networks: node_modules validate-networks
	npx tsx packages/scripts/generateGoNetworks.ts | $(GOFMT) > go/pkg/networks/networks.gen.go
	npx tsx packages/scripts/codegen/generateGoNetworkFeatures.ts | $(GOFMT) > go/pkg/networks/features.gen.go

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE): node_modules
	rm -fr $(CANDYMACHINE_REPO)
	git clone git@github.com:TERITORI/$(CANDYMACHINE_REPO).git
	cd $(CANDYMACHINE_REPO) && git checkout 61028f26c8ca2662bab39eff23f28c322d1aa60e
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(CANDYMACHINE_REPO)/schema/nft-minter \
		--out $@ \
		--name $(BUNKER_MINTER_PACKAGE) \
		--no-bundle
	mkdir -p go/pkg/contracts/bunker_minter_types
	go run github.com/a-h/generate/cmd/schema-generate@v0.0.0-20220105161013-96c14dfdfb60 -i $(CANDYMACHINE_REPO)/schema/nft-minter/instantiate_msg.json -o go/pkg/contracts/bunker_minter_types/instantiate_msg.go -p bunker_minter_types
	go fmt ./go/pkg/contracts/bunker_minter_types
	rm -fr $(CANDYMACHINE_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE): node_modules
	rm -fr $(NAME_SERVICE_REPO)
	git clone git@github.com:TERITORI/$(NAME_SERVICE_REPO).git
	cd $(NAME_SERVICE_REPO) && git checkout 1a03f93e9d7b96712a7a2585a079cbe97e384724
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(NAME_SERVICE_REPO)/schema \
		--out $@ \
		--name $(NAME_SERVICE_PACKAGE) \
		--no-bundle
	mkdir -p go/pkg/contracts/name_service_types
	go run github.com/a-h/generate/cmd/schema-generate@v0.0.0-20220105161013-96c14dfdfb60 -i $(NAME_SERVICE_REPO)/schema/contract_info_response.json -o go/pkg/contracts/name_service_types/contract_info_response.go -p name_service_types
	go fmt ./go/pkg/contracts/name_service_types
	rm -fr $(NAME_SERVICE_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE): node_modules
	rm -fr $(RIOTER_FOOTER_REPO)
	git clone git@github.com:TERITORI/$(RIOTER_FOOTER_REPO).git
	cd $(RIOTER_FOOTER_REPO) && git checkout e5a5b22cc3e72e09df6b4642d62dc21d99ca34c3
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(RIOTER_FOOTER_REPO)/contracts/rioter_footer_nft/schema \
		--out $@ \
		--name $(RIOTER_FOOTER_PACKAGE) \
		--no-bundle
	rm -fr $(RIOTER_FOOTER_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(TOKEN_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(TOKEN_PACKAGE): node_modules
	rm -fr $(TOKEN_REPO)
	git clone git@github.com:TERITORI/$(TOKEN_REPO).git
	cd $(TOKEN_REPO) && git checkout c368eba82348c0f9cc538cee7401bcf673847dcc
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(TOKEN_REPO)/schema/nft-token \
		--out $@ \
		--name $(TOKEN_PACKAGE) \
		--no-bundle
	rm -fr $(TOKEN_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(DISTRIBUTOR_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(DISTRIBUTOR_PACKAGE): node_modules
	rm -fr $(TOKEN_REPO)
	git clone git@github.com:TERITORI/$(TOKEN_REPO).git
	cd $(TOKEN_REPO) && git checkout 61028f26c8ca2662bab39eff23f28c322d1aa60e
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(TOKEN_REPO)/schema/distributor \
		--out $@ \
		--name $(DISTRIBUTOR_PACKAGE) \
		--no-bundle
	rm -fr $(TOKEN_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(SQUAD_STAKING_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(SQUAD_STAKING_PACKAGE): node_modules
	rm -fr $(TOKEN_REPO)
	git clone git@github.com:TERITORI/$(TOKEN_REPO).git
	cd $(TOKEN_REPO) && git checkout afacbd6e9ad9561f98fd7e0eaa5580c916fda276
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(TOKEN_REPO)/schema/squad-staking \
		--out $@ \
		--name $(SQUAD_STAKING_PACKAGE) \
		--no-bundle
	rm -fr $(TOKEN_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(BREEDING_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(BREEDING_PACKAGE): node_modules
	rm -fr $(CANDYMACHINE_REPO)
	git clone git@github.com:TERITORI/$(CANDYMACHINE_REPO).git
	cd $(CANDYMACHINE_REPO) && git checkout 26e37212a24d8e9e4b52af3c8f0ec3837633732c
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(CANDYMACHINE_REPO)/schema/nft-breeding \
		--out $@ \
		--name $(BREEDING_PACKAGE) \
		--no-bundle
	mkdir -p go/pkg/contracts/breeding_types
	go run github.com/a-h/generate/cmd/schema-generate@v0.0.0-20220105161013-96c14dfdfb60 -i $(CANDYMACHINE_REPO)/schema/nft-breeding/instantiate_msg.json -o go/pkg/contracts/breeding_types/instantiate_msg.go -p breeding_types
	go fmt ./go/pkg/contracts/breeding_minter_types		
	rm -fr $(CANDYMACHINE_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(ADDR_LIST_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(ADDR_LIST_PACKAGE): node_modules
	rm -fr $(ADDR_LIST_REPO)
	git clone git@github.com:TERITORI/cw_addr_list.git
	cd $(ADDR_LIST_REPO) && git checkout 01dad8e4ec2998c74145f7be0901630b3720787b
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(ADDR_LIST_REPO)/schema \
		--out $@ \
		--name $(ADDR_LIST_PACKAGE) \
		--no-bundle
	rm -fr $(ADDR_LIST_REPO)

.PHONY: publish.backend
publish.backend:
	docker build -f go/cmd/teritori-dapp-backend/Dockerfile .  --platform linux/amd64 -t $(BACKEND_DOCKER_IMAGE)
	docker push $(BACKEND_DOCKER_IMAGE)

.PHONY: publish.flush-data
publish.flush-data:
	docker build -f go/cmd/flush-data/Dockerfile .  --platform linux/amd64 -t $(FLUSH_DATA_IMAGE)
	docker push $(FLUSH_DATA_IMAGE)

.PHONY: publish.evm-indexer
publish.evm-indexer:
	docker build -f go/cmd/evm-indexer/Dockerfile .  --platform linux/amd64 -t $(EVM_INDEXER_IMAGE)
	docker push $(EVM_INDEXER_IMAGE)

.PHONY: publish.indexer
publish.indexer:
	docker build -f go/cmd/teritori-indexer/Dockerfile . --platform linux/amd64 -t $(INDEXER_DOCKER_IMAGE)
	docker push $(INDEXER_DOCKER_IMAGE)

.PHONY: publish.prices-service
publish.prices-service:
	docker build -f go/cmd/prices-service/Dockerfile .  --platform linux/amd64 -t $(PRICES_SERVICE_DOCKER_IMAGE)
	docker push $(PRICES_SERVICE_DOCKER_IMAGE)

.PHONY: publish.prices-ohlc-refresh
publish.prices-ohlc-refresh:
	docker build -f go/cmd/prices-ohlc-refresh/Dockerfile . --platform linux/amd64 -t $(PRICES_OHLC_REFRESH_DOCKER_IMAGE)
	docker push $(PRICES_OHLC_REFRESH_DOCKER_IMAGE)

.PHONY: generate.sqlboiler-prices
generate.sqlboiler-prices:
	go install github.com/volatiletech/sqlboiler/v4@latest
	go install github.com/volatiletech/sqlboiler/v4/drivers/sqlboiler-psql@latest
	sqlboiler psql

.PHONY: publish.p2e-update-leaderboard
publish.p2e-update-leaderboard:
	docker build -f go/cmd/p2e-update-leaderboard/Dockerfile . --platform linux/amd64 -t $(P2E_DOCKER_IMAGE)
	docker push $(P2E_DOCKER_IMAGE)

.PHONY: publish.feed-clean-pinata-keys
publish.feed-clean-pinata-keys:
	docker build -f go/cmd/feed-clean-pinata-keys/Dockerfile . --platform linux/amd64 -t $(FEED_DOCKER_IMAGE)
	docker push $(FEED_DOCKER_IMAGE)

.PHONY: publish.multisig-backend
publish.multisig-backend:
	docker build -f go/cmd/multisig-backend/Dockerfile . --platform linux/amd64 -t $(MULTISIG_DOCKER_IMAGE)
	docker push $(MULTISIG_DOCKER_IMAGE)

.PHONY: validate-networks
validate-networks: node_modules
	yarn validate-networks

.PHONY: networks.json
networks.json: node_modules validate-networks
	npx tsx packages/scripts/generateJSONNetworks.ts > $@

.PHONY: unused-exports
unused-exports: node_modules
	## TODO unexclude all paths except packages/api;packages/contracts-clients;packages/evm-contracts-clients
	yarn unused-exports

.PHONY: prepare-electron
prepare-electron: node_modules
	yarn rimraf ./dist
	yarn cross-env isElectron=prod expo export -p web
	yarn rimraf ./electron/web-build
	mkdir ./electron/web-build
	cp -r ./dist/* ./electron/web-build
	yarn tsx ./packages/scripts/electron/fixHTML.ts

# requires prepare-electron
.PHONY: build-electron-mac-amd64
build-electron-macos-amd64:
	rm -fr ./electron/dist
	rm -fr ./electron/build
	cd ./electron && npm i
	cd ./weshd && GOOS=darwin GOARCH=amd64 $(GO) build -tags noNativeLogger -o ../electron/build/mac ./go/electron/prod.go
	cd ./electron && node ./builder/mac.js amd64

# requires prepare-electron
.PHONY: build-electron-mac-arm64
build-electron-macos-arm64:
	rm -fr ./electron/dist
	rm -fr ./electron/build
	cd ./electron && npm i
	cd ./weshd && GOOS=darwin GOARCH=arm64 $(GO) build -tags noNativeLogger -o ../electron/build/mac ./go/electron/prod.go
	cd ./electron && node ./builder/mac.js arm64

# requires prepare-electron
.PHONY: build-electron-win
build-electron-windows-amd64:
	rm -fr ./electron/dist
	rm -fr ./electron/build
	cd ./electron && npm i
	cd ./weshd && GOOS=windows GOARCH=amd64 $(GO) build -tags noNativeLogger -o ../electron/build/win.exe ./go/electron/prod.go
	cd ./electron && node ./builder/win.js

# requires prepare-electron
.PHONY: build-electron-linux
build-electron-linux-amd64:
	rm -fr ./electron/dist
	rm -fr ./electron/build
	cd ./electron && npm i
	cd ./weshd && GOOS=linux GOARCH=amd64 $(GO) build -tags noNativeLogger -o ../electron/build/linux ./go/electron/prod.go
	cd ./electron && node ./builder/linux.js

.PHONY: check-ios-weshframework
check-ios-weshframework:
	@if [ ! -e ./weshd/ios/Frameworks/WeshFramework.xcframework ]; then \
		echo "WeshFramework does not exist. Running a command to create it."; \
		$(MAKE) build-ios-weshframework; \
	fi

.PHONY: build-ios-weshframework
build-ios-weshframework:
	$(MAKE) init-weshd-go
	cd ./weshd && GOARCH=$(ARCH) gomobile bind -v \
	-o ./ios/Frameworks/WeshFramework.xcframework \
	-tags 'nowatchdog' -target ios \
	./go/app

.PHONY: check-android-weshframework
check-android-weshframework:
	@if [ ! -e ./weshd/android/libs/WeshFramework.aar ]; then \
		echo "WeshFramework does not exist. Running a command to create it."; \
		$(MAKE) build-android-weshframework; \
	fi

.PHONY: build-android-weshframework
build-android-weshframework:
	mkdir -p ./weshd/android/libs
	$(MAKE) init-weshd-go
	CGO_CPPFLAGS="-Wno-error -Wno-nullability-completeness -Wno-expansion-to-defined -DHAVE_GETHOSTUUID=0"
	cd ./weshd && gomobile bind \
	-javapkg=com.weshnet \
	-o ./android/libs/WeshFramework.aar \
	-tags "fts5 sqlite sqlite_unlock_notify" -tags 'nowatchdog' -target android -androidapi 21 \
	./go/app

.PHONY: init-weshd-go
init-weshd-go:
	cd ./weshd && go mod tidy
	cd ./weshd && go get golang.org/x/mobile/cmd/gobind
	cd ./weshd && go get golang.org/x/mobile/cmd/gomobile
	cd ./weshd && go install golang.org/x/mobile/cmd/gobind
	cd ./weshd && go install golang.org/x/mobile/cmd/gomobile
	cd ./weshd && gomobile init

.PHONY: bump-app-build-number
bump-app-build-number:  
	npx tsx packages/scripts/app-build/bumpBuildNumber.ts $(shell echo $$(($$(git rev-list HEAD --count) + 10)))

.PHONY: test.rust
test.rust:
	for file in $(INTERNAL_COSMWASM_CONTRACTS); do \
		echo "> Testing $${file}" ; \
		cd $${file} ; \
		cargo test ; \
		cd - ; \
	done

.PHONY: build.rust
build.rust:
	for file in $(INTERNAL_COSMWASM_CONTRACTS); do \
		echo "> Building $${file}" ; \
		cd $${file} ; \
		cargo wasm ; \
		cd - ; \
	done

.PHONY: generate.internal-contracts-clients
generate.internal-contracts-clients: node_modules
	for indir in $(INTERNAL_COSMWASM_CONTRACTS) ; do \
		echo "> Generating client for $${indir}" ; \
		rm -fr $${indir}/schema ; \
		(cd $${indir} && cargo schema && cd -) || exit 1 ; \
		pkgname="$$(basename $${indir})" ; \
		outdir="$(CONTRACTS_CLIENTS_DIR)/$${pkgname}" ; \
		rm -fr $${outdir} ; \
		npx cosmwasm-ts-codegen generate \
			--plugin client \
			--schema $${indir}/schema \
			--out $${outdir} \
			--name $${pkgname} \
			--no-bundle \
		|| exit 1 ;\
		npx tsx packages/scripts/makeTypescriptIndex $${outdir} || exit 1 ; \
	done
	
