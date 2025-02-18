# Optimized builds
# docker run --rm -v "$(pwd)/rust":/code \
#   --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
#   --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
#   cosmwasm/workspace-optimizer-arm64:0.15.0

docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer-arm64:0.15.0 ./rust/cw-contracts/nft-launchpad