node_modules: package.json yarn.lock
	yarn
	touch $@

.PHONY: generate
generate: node_modules
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	buf generate api
	sed -i.bak 's/3_000/3000/' packages/api/marketplace/v1/marketplace.ts
	rm packages/api/marketplace/v1/marketplace.ts.bak

.PHONY: lint
lint: node_modules
	buf lint api
	yarn lint