import { MarketplaceService } from "../api/marketplace/v1/marketplace";
import { parseNftId, parseUserId } from "../networks";

const batchSize = 1000;

// returns the number of nfts owned per address
export const snapshotCollectionOwners = async (
  collectionId: string,
  backendClient: MarketplaceService | undefined,
) => {
  const listByOwner = await snapshotCollectionOwnersWithIds(
    collectionId,
    backendClient,
  );
  return Object.entries(listByOwner).reduce(
    (result, [key, list]) => {
      result[key] = list.length;
      return result;
    },
    {} as { [key: string]: number },
  );
};

// returns the list of nfts owned per address
export const snapshotCollectionOwnersWithIds = async (
  collectionId: string,
  backendClient: MarketplaceService | undefined,
) => {
  if (!backendClient) {
    return {};
  }
  let offset = 0;
  const listByOwner: { [key: string]: string[] } = {};
  const seen: { [key: string]: boolean } = {};
  while (true) {
    const srv = backendClient.NFTs({
      limit: batchSize,
      offset,
      collectionId,
    });
    let remain = false;
    let count = 0;
    await srv.forEach((res) => {
      if (!res.nft) {
        return;
      }
      const [, addr] = parseUserId(res.nft.ownerId);
      if (!listByOwner[addr]) listByOwner[addr] = [];
      const [, , tokenId] = parseNftId(res.nft.id);
      if (seen[tokenId]) {
        throw new Error(`${tokenId} already seen`);
      }
      seen[tokenId] = true;
      listByOwner[addr].push(tokenId);
      remain = true;
      count++;
    });
    offset += count;
    if (!remain) {
      break;
    }
  }
  // FIXME: check that the total match the collection total supply
  return listByOwner;
};

// returns the count of nfts by address that minted an nft and never tried to sell it
export const snapshotCollectionOGs = async (
  collectionId: string,
  backendClient: MarketplaceService | undefined,
) => {
  if (!backendClient) {
    return {};
  }
  let offset = 0;
  const countByMinter: { [key: string]: string[] } = {};
  const listed: { [key: string]: boolean } = {};
  while (true) {
    const srv = backendClient.Activity({
      limit: batchSize,
      offset,
      collectionId,
    });
    let remain = false;
    let count = 0;
    await srv.forEach((res) => {
      if (!res.activity) {
        return;
      }
      if (res.activity.transactionKind === "mint") {
        const [, addr] = parseUserId(res.activity.buyerId);
        if (!countByMinter[addr]) countByMinter[addr] = [];
        countByMinter[addr].push(res.activity.targetName);
      }
      if (
        res.activity.transactionKind === "list" ||
        res.activity.transactionKind === "transfer-nft" ||
        res.activity.transactionKind === "send-nft"
      ) {
        const nftName = res.activity.targetName;
        listed[nftName] = true;
      }
      remain = true;
      count++;
    });
    offset += count;
    if (!remain) {
      break;
    }
  }
  const holders = Object.entries(countByMinter).reduce(
    (result, [addr, minted]) => {
      const held = minted.filter((n) => !listed[n]);
      if (held.length === 0) {
        return result;
      }
      result[addr] = held.length;
      return result;
    },
    {} as { [key: string]: number },
  );
  return holders;
};
