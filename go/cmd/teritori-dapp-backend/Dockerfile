# syntax=docker/dockerfile:1

FROM golang:1.18-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY go ./go

RUN go build ./go/cmd/teritori-dapp-backend

CMD [ "/app/teritori-dapp-backend" ]