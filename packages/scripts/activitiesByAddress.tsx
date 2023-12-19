import { mustGetNodeMarketplaceClient } from "./lib";
import { Activity, Collection } from "../api/marketplace/v1/marketplace";
import { parseUserId } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const network = teritoriNetwork;
  const marketplaceClient = mustGetNodeMarketplaceClient(network.id);
  const collectionsStream = marketplaceClient.Collections({
    limit: 1000,
    networkId: network.id,
  });
  const collections: Collection[] = [];
  await collectionsStream.forEach(({ collection }) => {
    if (!collection) {
      return;
    }
    collections.push(collection);
  });
  const activities: { [key: string]: Activity } = {};
  const limit = 10000;
  // let i = 0;
  for (const coll of collections) {
    // console.log(coll.collectionName, `${i}/${collections.length}`);
    let offset = 0;
    let some = true;
    while (some) {
      const res = marketplaceClient.Activity({
        collectionId: coll.id,
        limit,
        offset,
      });
      some = false;
      await res.forEach(({ activity }) => {
        if (!activity) {
          return;
        }
        some = true;
        offset += 1;
        activities[activity.id] = activity;
      });
    }
    // i++;
  }
  const initAddress = (address: string) => {
    if (!activitiesByAddress[address]) {
      activitiesByAddress[address] = {
        listings: 0,
        buys: 0,
        sales: 0,
        mints: 0,
      };
    }
  };
  const activitiesByAddress: { [key: string]: ActivitiesCounts } = {};
  for (const activity of Object.values(activities)) {
    switch (activity.transactionKind) {
      case "mint": {
        const [, address] = parseUserId(activity.buyerId);
        if (!address) {
          throw new Error("no address");
        }
        initAddress(address);
        activitiesByAddress[address].mints += 1;
        break;
      }
      case "trade": {
        const [, buyerAddress] = parseUserId(activity.buyerId);
        const [, sellerAddress] = parseUserId(activity.sellerId);
        if (!buyerAddress || !sellerAddress) {
          throw new Error("no address");
        }
        initAddress(buyerAddress);
        activitiesByAddress[buyerAddress].buys += 1;
        initAddress(sellerAddress);
        activitiesByAddress[sellerAddress].sales += 1;
        break;
      }
      case "list": {
        const [, address] = parseUserId(activity.sellerId);
        if (!address) {
          throw new Error("no address");
        }
        initAddress(address);
        activitiesByAddress[address].listings += 1;
        break;
      }
    }
  }
  // print csv
  const keys = ["address", "listings", "buys", "sales", "mints"];
  let out = keys.join(",") + "\n";
  for (const [address, counts] of Object.entries(activitiesByAddress)) {
    out += `${address},${counts.listings},${counts.buys},${counts.sales},${counts.mints}\n`;
  }
  console.log(out);
};

type ActivitiesCounts = {
  listings: number;
  buys: number;
  sales: number;
  mints: number;
};

main();
