CANDYMACHINE_REPO=teritori-nfts
BUNKER_MINTER_PACKAGE=teritori-bunker-minter

TOKEN_REPO=teritori-nfts
TOKEN_PACKAGE=teritori-nft
SQUAD_STAKING_PACKAGE=teritori-squad-staking
BREEDING_PACKAGE=teritori-breeding
DISTRIBUTOR_PACKAGE=teritori-distributor

NAME_SERVICE_REPO=teritori-name-service
NAME_SERVICE_PACKAGE=teritori-name-service

RIOTER_FOOTER_REPO=rioters-footer-nft
RIOTER_FOOTER_PACKAGE=rioter-footer-nft

VAULT_REPO=teritori-vault
VAULT_PACKAGE=teritori-nft-vault

CONTRACTS_CLIENTS_DIR=packages/contracts-clients

DOCKER_REGISTRY=rg.nl-ams.scw.cloud/teritori
INDEXER_DOCKER_IMAGE=$(DOCKER_REGISTRY)/teritori-indexer:$(shell git rev-parse --short HEAD)
BACKEND_DOCKER_IMAGE=$(DOCKER_REGISTRY)/teritori-dapp-backend:$(shell git rev-parse --short HEAD)
PRICES_SERVICE_DOCKER_IMAGE=$(DOCKER_REGISTRY)/prices-service:$(shell git rev-parse --short HEAD)
PRICES_OHLC_REFRESH_DOCKER_IMAGE=$(DOCKER_REGISTRY)/prices-ohlc-refresh:$(shell git rev-parse --short HEAD)
P2E_DOCKER_IMAGE=$(DOCKER_REGISTRY)/p2e-update-leaderboard:$(shell git rev-parse --short HEAD)
FEED_DOCKER_IMAGE=$(DOCKER_REGISTRY)/feed-clean-pinata-keys:$(shell git rev-parse --short HEAD)

node_modules: package.json yarn.lock
	yarn
	touch $@

.PHONY: generate
generate: generate.protobuf generate.weshnet generate.graphql generate.contracts-clients generate.go-networks networks.json

.PHONY: generate.protobuf
generate.protobuf: node_modules
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	buf generate api

.PHONY: generate.weshnet
generate.weshnet: node_modules
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	buf generate buf.build/berty/weshnet -o .weshgen
	cp -r .weshgen/packages/api/ packages/weshnet/
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
generate.contracts-clients: $(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(TOKEN_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE)

.PHONY: generate.go-networks
generate.go-networks: node_modules validate-networks
	npx ts-node packages/scripts/generateGoNetworks.ts | gofmt > go/pkg/networks/networks.gen.go

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

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE): node_modules
	rm -fr $(VAULT_REPO)
	git clone git@github.com:TERITORI/$(VAULT_REPO).git
	cd $(VAULT_REPO) && git checkout 75a692533b9188587ebfa909c5576376b8d65999
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(VAULT_REPO)/contracts/nft-vault/schema \
		--out $@ \
		--name $(VAULT_PACKAGE) \
		--no-bundle
	mkdir -p go/pkg/contracts/vault_types
	go run github.com/a-h/generate/cmd/schema-generate@v0.0.0-20220105161013-96c14dfdfb60 -i $(VAULT_REPO)/contracts/nft-vault/schema/execute_msg.json -o go/pkg/contracts/vault_types/execute_msg.go -p vault_types
	go fmt ./go/pkg/contracts/vault_types
	rm -fr $(VAULT_REPO)

.PHONY: publish.backend
publish.backend:
	docker build -f go/cmd/teritori-dapp-backend/Dockerfile .  --platform amd64 -t $(BACKEND_DOCKER_IMAGE)
	docker push $(BACKEND_DOCKER_IMAGE)

.PHONY: publish.indexer
publish.indexer:
	docker build -f go/cmd/teritori-indexer/Dockerfile . --platform amd64 -t $(INDEXER_DOCKER_IMAGE)
	docker push $(INDEXER_DOCKER_IMAGE)

.PHONY: publish.prices-service
publish.prices-service:
	docker build -f go/cmd/prices-service/Dockerfile .  --platform amd64 -t $(PRICES_SERVICE_DOCKER_IMAGE)
	docker push $(PRICES_SERVICE_DOCKER_IMAGE)

.PHONY: publish.prices-ohlc-refresh
publish.prices-ohlc-refresh:
	docker build -f go/cmd/prices-ohlc-refresh/Dockerfile . --platform amd64 -t $(PRICES_OHLC_REFRESH_DOCKER_IMAGE)
	docker push $(PRICES_OHLC_REFRESH_DOCKER_IMAGE)

.PHONY: generate.sqlboiler-prices
generate.sqlboiler-prices:
	go install github.com/volatiletech/sqlboiler/v4@latest
	go install github.com/volatiletech/sqlboiler/v4/drivers/sqlboiler-psql@latest
	sqlboiler psql

.PHONY: publish.p2e-update-leaderboard
publish.p2e-update-leaderboard:
	docker build -f go/cmd/p2e-update-leaderboard/Dockerfile . --platform amd64 -t $(P2E_DOCKER_IMAGE)
	docker push $(P2E_DOCKER_IMAGE)

.PHONY: publish.feed-clean-pinata-keys
publish.feed-clean-pinata-keys:
	docker build -f go/cmd/feed-clean-pinata-keys/Dockerfile . --platform amd64 -t $(FEED_DOCKER_IMAGE)
	docker push $(FEED_DOCKER_IMAGE)

.PHONY: validate-networks
validate-networks: node_modules
	npx ts-node packages/scripts/validateNetworks.ts

.PHONY: networks.json
networks.json: node_modules validate-networks
	npx ts-node packages/scripts/generateJSONNetworks.ts > $@
