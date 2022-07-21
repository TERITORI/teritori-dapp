# Teritori DApp Kubernetes config

## Deploy

### Create namespace and set as current

```sh
kubectl create namespace teritori
kubectl config set-context --current --namespace=teritori
```

### Set env variables

```sh
domain=<your-domain>
registry=<your-docker-registry>
```

### Build and push the image

```sh
registry=$registry ./docker-publish.sh
```

### Deploy

```sh
sed "s#YOUR_REGISTRY#${registry}#g" ./backend-deploy.yaml \
| sed "s#BACKEND_COMMIT#$(git rev-parse --short HEAD)#g" \
| kubectl apply -f -
```

### Create ingress

```sh
sed "s#YOUR_DOMAIN#${domain}#g" ./backend-ingress.yaml | kubectl apply -f -
```

The service will be available at `back.<your-domain>`
