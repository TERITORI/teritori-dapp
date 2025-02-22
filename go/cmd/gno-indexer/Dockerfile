# syntax=docker/dockerfile:1

ARG GO_VERSION="1.19"
ARG RUNNER_IMAGE="gcr.io/distroless/static"

# --------------------------------------------------------
# Builder
# --------------------------------------------------------

FROM golang:${GO_VERSION}-alpine as builder

RUN set -eux; apk add --no-cache ca-certificates build-base; apk add git linux-headers

# Download go dependencies
WORKDIR /app
COPY go.* ./
RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/root/go/pkg/mod \
  go mod download

# Cosmwasm - download correct libwasmvm version
RUN WASMVM_VERSION=$(go list -m github.com/CosmWasm/wasmvm | cut -d ' ' -f 2) && \
  wget https://github.com/CosmWasm/wasmvm/releases/download/$WASMVM_VERSION/libwasmvm_muslc.$(uname -m).a \
  -O /lib/libwasmvm_muslc.a

# Copy the remaining files
COPY go ./go
COPY .git ./.git

# Build teritorid binary
RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/root/go/pkg/mod \
  VERSION=$(echo $(git describe --tags) | sed 's/^v//') && \
  COMMIT=$(git log -1 --format='%H') && \
  go build \
  -mod=readonly \
  -tags "netgo,ledger,muslc" \
  -ldflags "-X github.com/cosmos/cosmos-sdk/version.Name="teritori" \
  -X github.com/cosmos/cosmos-sdk/version.AppName="teritorid" \
  -X github.com/cosmos/cosmos-sdk/version.Version=$VERSION \
  -X github.com/cosmos/cosmos-sdk/version.Commit=$COMMIT \
  -X github.com/cosmos/cosmos-sdk/version.BuildTags='netgo,ledger,muslc' \
  -w -s -linkmode=external -extldflags '-Wl,-z,muldefs -static'" \
  -trimpath \
  -o /app/build/ \
  ./go/cmd/gno-indexer

# --------------------------------------------------------
# Runner
# --------------------------------------------------------

FROM ${RUNNER_IMAGE}

COPY --from=builder /app/build/gno-indexer /bin/gno-indexer



ENV HOME /app
WORKDIR $HOME

COPY networks.json $HOME/networks.json

ENTRYPOINT ["gno-indexer"]
