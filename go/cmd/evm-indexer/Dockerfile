# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY go ./go

RUN go build -o /evm-indexer ./go/cmd/evm-indexer

RUN touch /.env

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian12 AS runner

WORKDIR /

COPY --from=builder /evm-indexer /usr/bin/evm-indexer
COPY --from=builder /.env /app/.env

ENV HOME /app
WORKDIR $HOME
COPY networks.json $HOME/networks.json
COPY ./go/internal/substreams /app/go/internal/substreams

ENTRYPOINT ["evm-indexer"]
