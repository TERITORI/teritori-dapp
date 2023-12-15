import { Secp256k1HdWallet } from "@cosmjs/amino";
import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { program } from "commander";

import { retry } from "./lib";
import { CwAddressListQueryClient } from "../contracts-clients/cw-address-list/CwAddressList.client";
import {
  Bound,
  ExecMsg,
} from "../contracts-clients/cw-address-list/CwAddressList.types";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import {
  CosmosNetworkInfo,
  NetworkKind,
  cosmosNetworkGasPrice,
  getCollectionId,
  mustGetNonSigningCosmWasmClient,
  parseCollectionId,
} from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const contractAddress =
  "tori13ndm72c7k5mxj9jfhf2a3f0pfufju5t5wavqhkvggwljgc0vpwtquz9l8y";

const mnemo = "fill-me";

const main = async () => {
  const network = teritoriNetwork;

  program.argument(
    "<collections>",
    "comma separated list of collections ids addresses",
  );
  program.parse();

  const [collectionsInput] = program.args as [string];
  const collectionsIds = collectionsInput
    .split(",")
    .map((s) => s.trim())
    .map((s) => getCollectionId(network.id, s));

  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemo, {
    prefix: network.addressPrefix,
  });
  const [{ address: sender }] = await wallet.getAccounts();
  const collectionsAddresses = await deriveCollectionsAddresses(collectionsIds);
  const currentWhitelist = await getCurrentWhitelist(network);
  const diff = getDiff(collectionsAddresses, currentWhitelist);
  if (diff.toAdd.length === 0 && diff.toRemove.length === 0)
    return console.log("Nothing to do");
  console.log(diff);
  const addMsgs: MsgExecuteContractEncodeObject[] = diff.toAdd.map((addr) => {
    const payload: ExecMsg = {
      add: {
        addr,
      },
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender,
        contract: contractAddress,
        msg: Buffer.from(JSON.stringify(payload), "utf-8"),
        funds: [],
      },
    };
  });
  const removeMsgs: MsgExecuteContractEncodeObject[] = diff.toRemove.map(
    (addr) => {
      const payload: ExecMsg = {
        remove: {
          addr,
        },
      };
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          contract: contractAddress,
          msg: Buffer.from(JSON.stringify(payload), "utf-8"),
          funds: [],
        },
      };
    },
  );
  const msgs = [...addMsgs, ...removeMsgs];
  retry(5, async () => {
    const client = await SigningCosmWasmClient.connectWithSigner(
      network.rpcEndpoint,
      wallet,
      {
        gasPrice: cosmosNetworkGasPrice(network, "low"),
      },
    );
    await client.signAndBroadcast(sender, msgs, "auto");
  });
  const remoteWhitelist = await getCurrentWhitelist(network);
  const remoteDiff = getDiff(collectionsAddresses, remoteWhitelist);
  if (remoteDiff.toAdd.length === 0 && remoteDiff.toRemove.length === 0)
    return console.log("Success");
  throw new Error(
    "Something went wrong, final whitelist does not match target whitelist",
  );
};

const deriveCollectionsAddresses = async (ids: string[]): Promise<string[]> => {
  const addresses = [];
  for (const id of ids) {
    const [network, minterContractAddress] = parseCollectionId(id);
    if (network?.kind !== NetworkKind.Cosmos) {
      throw new Error("invalid network in collection id: " + id);
    }
    if (minterContractAddress === network.nameServiceContractAddress) {
      addresses.push(minterContractAddress);
      continue;
    }
    const cosmWasmClient = await retry(10, () =>
      mustGetNonSigningCosmWasmClient(network.id),
    );
    try {
      const address = await retry(10, async () => {
        const minterClient = new TeritoriBunkerMinterQueryClient(
          cosmWasmClient,
          minterContractAddress,
        );
        const config: any = await minterClient.config();
        return config.nft_addr || config.child_contract_addr;
      });
      if (!address) {
        throw new Error("no address found for collection: " + id);
      }
      addresses.push(address);
      continue;
    } catch (e) {
      throw e;
    }
  }
  return addresses;
};

const getCurrentWhitelist = async (
  network: CosmosNetworkInfo,
): Promise<string[]> => {
  const cosmWasmClient = await retry(10, () =>
    mustGetNonSigningCosmWasmClient(network.id),
  );
  const client = new CwAddressListQueryClient(cosmWasmClient, contractAddress);
  const whitelist = [];
  while (true) {
    const min: Bound | undefined = whitelist.length
      ? { exclusive: whitelist[whitelist.length - 1] }
      : undefined;
    const addresses: string[] = await retry(5, () => client.addresses({ min }));
    if (addresses.length === 0) {
      break;
    }
    whitelist.push(...addresses);
  }
  return whitelist;
};

const getDiff = (
  target: string[],
  current: string[],
): { toAdd: string[]; toRemove: string[] } => {
  const toAdd = [...new Set(target.filter((addr) => !current.includes(addr)))];
  const toRemove = [
    ...new Set(current.filter((addr) => !target.includes(addr))),
  ];
  return { toAdd, toRemove };
};

main();
