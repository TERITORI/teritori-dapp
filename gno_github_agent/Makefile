DOCKER_REGISTRY=rg.nl-ams.scw.cloud/teritori
AGENT_DOCKER_IMAGE=$(DOCKER_REGISTRY)/gno-gh-verify-agent:$(shell git rev-parse --short HEAD)

.PHONY: publish
publish:
	docker build .  --platform linux/amd64 -t $(AGENT_DOCKER_IMAGE)
	docker push $(AGENT_DOCKER_IMAGE)
