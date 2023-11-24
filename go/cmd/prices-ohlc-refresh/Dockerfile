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

# Copy the remaining files
COPY go ./go
COPY .git ./.git

# Build binary
RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/root/go/pkg/mod \
  go build \
  -mod=readonly \
  -tags "muslc" \
  -ldflags "-w -s -linkmode=external -extldflags '-Wl,-z,muldefs -static'" \
  -trimpath \
  -o /app/build/ \
  ./go/cmd/prices-ohlc-refresh

# --------------------------------------------------------
# Runner
# --------------------------------------------------------

FROM ${RUNNER_IMAGE}

COPY --from=builder /app/build/prices-ohlc-refresh /bin/prices-ohlc-refresh

ENV HOME /app
WORKDIR $HOME

ENTRYPOINT ["prices-ohlc-refresh"]
