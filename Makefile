CANDYMACHINE_REPO=terra-candymachine
CANDYMACHINE_PACKAGE=teritori-nft-minter

node_modules: package.json yarn.lock
	yarn
	touch $@

.PHONY: generate
generate: generate.protobuf generate.graphql

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

.PHONY: packages/$(CANDYMACHINE_PACKAGE)
packages/$(CANDYMACHINE_PACKAGE): node_modules
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
