#!/bin/sh
image=$registry/teritori/teritori-dapp-backend:$(git rev-parse --short HEAD)
docker build .. -f ../go/cmd/teritori-dapp-backend/Dockerfile -t $image
docker push $image
