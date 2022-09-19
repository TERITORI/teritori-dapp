#!/bin/sh

backend_image=$registry/teritori/teritori-dapp-backend:$(git rev-parse --short HEAD)
docker build .. -f ../go/cmd/teritori-dapp-backend/Dockerfile -t $backend_image
docker push $backend_image

indexer_image=$registry/teritori/teritori-indexer:$(git rev-parse --short HEAD)
docker build .. -f ../go/cmd/teritori-indexer/Dockerfile -t $indexer_image
docker push $indexer_image
