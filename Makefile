CANDYMACHINE_REPO=teritori-nfts
BUNKER_MINTER_PACKAGE=teritori-bunker-minter

TOKEN_REPO=teritori-nfts
TOKEN_PACKAGE=teritori-nft

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

node_modules: package.json yarn.lock
	yarn
	touch $@

.PHONY: generate
generate: generate.protobuf generate.graphql generate.contracts-clients

.PHONY: generate.protobuf
generate.protobuf: node_modules
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	buf generate api

.PHONY: generate.graphql
generate.graphql:
	go run github.com/Khan/genqlient@85e2e8dffd211c83a2be626474993ef68e44a242 go/pkg/holagql/genqlient.yaml

.PHONY: lint
lint: node_modules
	buf lint api
	yarn lint

.PHONY: go/pkg/holagql/holaplex-schema.graphql
go/pkg/holagql/holaplex-schema.graphql:
	rover graph introspect https://graph.65.108.73.219.nip.io/v1 > $@

.PHONY: docker.backend
docker.backend:
	docker build . -f go/cmd/teritori-dapp-backend/Dockerfile -t teritori/teritori-dapp-backend:$(shell git rev-parse --short HEAD)

.PHONY: generate.contracts-clients
generate.contracts-clients: $(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(TOKEN_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(BUNKER_MINTER_PACKAGE): node_modules
	rm -fr $(CANDYMACHINE_REPO)
	git clone git@github.com:TERITORI/$(CANDYMACHINE_REPO).git
	cd $(CANDYMACHINE_REPO) && git checkout 4d1658abee454a20bff504b6dce0eba25e69708c
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
	cd $(NAME_SERVICE_REPO) && git checkout 4124a8263a2e823b3a9b731efde37a725488253d
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

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(VAULT_PACKAGE): node_modules
	rm -fr $(VAULT_REPO)
	git clone git@github.com:TERITORI/$(VAULT_REPO).git
	cd $(VAULT_REPO) && git checkout a04e44fe54ed798d96659098914af72a0c36d8f5
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

run.candymachine: node_modules
	npx ts-node packages/candymachine/cli.ts

publish.backend:
	docker build -f go/cmd/teritori-dapp-backend/Dockerfile .  --platform amd64 -t $(BACKEND_DOCKER_IMAGE)
	docker push $(BACKEND_DOCKER_IMAGE)

publish.indexer:
	docker build -f go/cmd/teritori-indexer/Dockerfile . --platform amd64 -t $(INDEXER_DOCKER_IMAGE)
	docker push $(INDEXER_DOCKER_IMAGE)
