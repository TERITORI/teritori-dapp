CANDYMACHINE_REPO=terra-candymachine
CANDYMACHINE_PACKAGE=teritori-nft-minter

NAME_SERVICE_REPO=teritori-name-service
NAME_SERVICE_PACKAGE=teritori-name-service

RIOTER_FOOTER_REPO=rioter-footer-nft
RIOTER_FOOTER_PACKAGE=rioter-footer-nft

CONTRACTS_CLIENTS_DIR=packages/contracts-clients

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
generate.contracts-clients: $(CONTRACTS_CLIENTS_DIR)/$(CANDYMACHINE_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE) $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(CANDYMACHINE_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(CANDYMACHINE_PACKAGE): node_modules
	rm -fr $(CANDYMACHINE_REPO)
	git clone git@github.com:TERITORI/$(CANDYMACHINE_REPO).git
	cd $(CANDYMACHINE_REPO) && git checkout e14d8abab6c82fd44f6d3d229bb278227cecc7e7
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(CANDYMACHINE_REPO)/schema/nft-minter \
		--out $@ \
		--name $(CANDYMACHINE_PACKAGE) \
		--no-bundle
	rm -fr $(CANDYMACHINE_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(NAME_SERVICE_PACKAGE): node_modules
	rm -fr $(NAME_SERVICE_REPO)
	git clone git@github.com:TERITORI/$(NAME_SERVICE_REPO).git
	cd $(NAME_SERVICE_REPO) && git checkout 251733d569b931fdfcc15cedb7414bafe5ba2598
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(NAME_SERVICE_REPO)/schema \
		--out $@ \
		--name $(NAME_SERVICE_PACKAGE) \
		--no-bundle
	rm -fr $(NAME_SERVICE_REPO)

.PHONY: $(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE)
$(CONTRACTS_CLIENTS_DIR)/$(RIOTER_FOOTER_PACKAGE): node_modules
	rm -fr $(RIOTER_FOOTER_REPO)
	git clone git@github.com:TERITORI/$(RIOTER_FOOTER_REPO).git
	cd $(RIOTER_FOOTER_REPO) && git checkout a75455535551010acbc33784aa09ff2b1a890a7d
	rm -fr $@
	npx cosmwasm-ts-codegen generate \
		--plugin client \
		--schema $(RIOTER_FOOTER_REPO)/contracts/rioter_footer_nft/schema \
		--out $@ \
		--name $(RIOTER_FOOTER_PACKAGE) \
		--no-bundle
	rm -fr $(RIOTER_FOOTER_REPO)
