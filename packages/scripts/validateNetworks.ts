import { allNetworks, getNativeCurrency, NetworkKind } from "../networks";

const ids: { [key: string]: boolean } = {};
const idPrefixes: { [key: string]: boolean } = {};
const cosmosChainIds: { [key: string]: boolean } = {};
const ethereumChainIds: { [key: number]: boolean } = {};
const gnoChainIds: { [key: string]: boolean } = {};

for (const net of allNetworks) {
  // id must be unique
  if (ids[net.id]) {
    throw new Error(`id '${net.id}' is not unique`);
  }
  ids[net.id] = true;

  // id prefix must be unique
  if (idPrefixes[net.idPrefix]) {
    throw new Error(`id prefix '${net.idPrefix}' is not unique`);
  }
  idPrefixes[net.idPrefix] = true;

  // chain id must be unique for this network kind
  switch (net.kind) {
    case NetworkKind.Ethereum: {
      if (ethereumChainIds[net.chainId]) {
        throw new Error(
          `ethereum chain id '${net.chainId}' for network '${net.id}' is not unique`,
        );
      }
      ethereumChainIds[net.chainId] = true;
      break;
    }
    case NetworkKind.Cosmos: {
      if (cosmosChainIds[net.chainId]) {
        throw new Error(
          `cosmos chain id '${net.chainId}' for network '${net.id}' is not unique`,
        );
      }
      cosmosChainIds[net.chainId] = true;
      break;
    }
    case NetworkKind.Gno: {
      if (gnoChainIds[net.chainId]) {
        throw new Error(
          `gno chain id '${net.chainId}' for network '${net.id}' is not unique`,
        );
      }
      gnoChainIds[net.chainId] = true;
      break;
    }
  }

  // check currencies
  const denoms: { [key: string]: boolean } = {};
  for (const currency of net.currencies) {
    // denom must be unique for this network
    if (denoms[currency.denom]) {
      throw new Error(
        `currency denom '${currency.denom}' of network '${net.id}' is not unique`,
      );
    }
    denoms[currency.denom] = true;

    // target currency must exists for ibc currencies
    if (currency.kind === "ibc") {
      const nc = getNativeCurrency(net.id, currency.denom);
      if (!nc) {
        throw new Error(
          `invalid ibc currency '${currency.denom}' of network '${net.id}': currency '${currency.sourceDenom}' does not exists in network '${currency.sourceNetwork}'`,
        );
      }
    }
  }
}
