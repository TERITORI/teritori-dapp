import { IndexedTx } from "@cosmjs/stargate";
import child_process from "child_process";
import { program } from "commander";
import { cloneDeep } from "lodash";
import path from "path";

import {
  ExecuteMsg as NameServiceExecuteMsg,
  InstantiateMsg as NameServiceInstantiateMsg,
} from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { InstantiateMsg as MarketplaceVaultInstantiateMsg } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.types";
import { InstantiateMsg as SocialFeedInstantiateMsg } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  CosmosNetworkInfo,
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { zodTryParseJSON } from "../../utils/sanitize";
import { injectRPCPort, retry, zodTxResult } from "../lib";
import sqh from "../sqh";

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.parse();
  const [networkId, wallet] = program.args;
  const network = cloneDeep(getCosmosNetwork(networkId));
  if (!network) {
    console.error(`Cosmos network ${networkId} not found`);
    process.exit(1);
  }
  console.log(`Deploying to ${network.displayName}`);

  const walletAddr = child_process
    .execSync("teritorid keys show --keyring-backend test -a " + wallet)
    .toString()
    .trim();

  console.log("Wallet address:", walletAddr);

  console.log("Storing name service");
  const nameServiceWasmFilePath = path.join(__dirname, "name-service.wasm");
  network.nameServiceCodeId = await storeWASM(
    wallet,
    network,
    nameServiceWasmFilePath,
  );

  console.log("Instantiating name service", network.nameServiceCodeId);
  network.nameServiceContractAddress = await instantiateNameService(
    wallet,
    walletAddr,
    network,
  );

  // FIXME: no race
  console.log("Waiting for settlement");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("Storing social feed");
  const socialFeedWasmFilePath = path.join(__dirname, "social-feed.wasm");
  network.socialFeedCodeId = await storeWASM(
    wallet,
    network,
    socialFeedWasmFilePath,
  );

  console.log("Instantiating social feed", network.socialFeedCodeId);
  network.socialFeedContractAddress = await instantiateSocialFeed(
    wallet,
    walletAddr,
    network,
  );

  console.log("Storing marketplace vault");
  const marketplaceVaultWasmFilePath = path.join(
    __dirname,
    "marketplace-vault.wasm",
  );
  network.marketplaceVaultCodeId = await storeWASM(
    wallet,
    network,
    marketplaceVaultWasmFilePath,
  );

  console.log(
    "Instantiating marketplace vault",
    network.marketplaceVaultCodeId,
  );
  network.vaultContractAddress = await instantiateMarketplaceVault(
    wallet,
    walletAddr,
    network,
  );

  console.log(JSON.stringify(network, null, 2));
};

const instantiateMarketplaceVault = (
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.marketplaceVaultCodeId;
  if (!codeId) {
    throw new Error("Code ID not found");
  }
  const instantiateMsg: MarketplaceVaultInstantiateMsg = { fee_bp: "5" };
  const addr = instantiateContract(
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori Marketplace Vault",
    instantiateMsg,
  );
  return addr;
};

const instantiateSocialFeed = async (
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.socialFeedCodeId;
  if (!codeId) {
    throw new Error("Social feed code ID not found");
  }
  const instantiateMsg: SocialFeedInstantiateMsg = {};
  const addr = await instantiateContract(
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori Social Feed",
    instantiateMsg,
  );
  return addr;
};

const instantiateNameService = async (
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.nameServiceCodeId;
  if (!codeId) {
    throw new Error("Code ID not found");
  }
  const instantiateMsg: NameServiceInstantiateMsg = {
    admin_address: adminAddr,
    name: "Teritori Name Service",
    native_decimals: 6,
    native_denom: "utori",
    symbol: "TNS",
    domain: network.nameServiceTLD?.substring(1) || undefined,
  };
  const addr = await instantiateContract(
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori Name Service",
    instantiateMsg,
  );
  const feesMsg: NameServiceExecuteMsg = {
    set_authorized_characters: {
      is_authorized: true,
      char_type: "letter",
      chars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
    },
  };
  const cmd = `teritorid tx wasm execute ${addr} ${sqh(
    JSON.stringify(feesMsg),
  )} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend test -o json`;
  console.log("> " + cmd);
  child_process.execSync(cmd, {
    stdio: ["inherit", "pipe", "inherit"],
  });
  return addr;
};

const instantiateContract = async (
  wallet: string,
  network: CosmosNetworkInfo,
  codeId: number,
  admin: string,
  label: string,
  msg: unknown,
) => {
  const cmd = `teritorid tx wasm instantiate ${codeId} ${sqh(
    JSON.stringify(msg),
  )} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend test -o json --label ${sqh(
    label,
  )} --admin ${admin}`;
  console.log("> " + cmd);
  const out = await retry(5, () =>
    child_process.execSync(cmd, {
      stdio: ["inherit", "pipe", "inherit"],
    }),
  );
  const outObj = zodTryParseJSON(zodTxResult, out.toString());
  if (!outObj) {
    throw new Error("Failed to parse instantiate result");
  }
  const tx = await getTx(network.id, outObj.txhash);
  const contractAddress = mustGetAttr(tx, "instantiate", "_contract_address");
  return contractAddress;
};

const storeWASM = async (
  wallet: string,
  network: CosmosNetworkInfo,
  wasmFilePath: string,
) => {
  const cmd = `teritorid tx wasm store ${wasmFilePath} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend test -o json`;
  console.log("> " + cmd);
  const out = await retry(5, () =>
    child_process.execSync(cmd, {
      stdio: ["inherit", "pipe", "inherit"],
      encoding: "utf-8",
    }),
  );
  const outObj = zodTryParseJSON(zodTxResult, out);
  if (!outObj) {
    throw new Error("Failed to parse store result");
  }
  const { txhash } = outObj;
  const tx = await getTx(network.id, txhash);
  const codeId = mustGetAttr(tx, "store_code", "code_id");
  return +codeId;
};

// FIXME: timeout
const getTx = async (networkId: string, txhash: string) => {
  let tx: IndexedTx | null = null;
  while (tx === null) {
    tx = await retry(5, async () => {
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      return client.getTx(txhash);
    });
  }
  return tx;
};

const getAttr = (tx: IndexedTx, eventKey: string, attrKey: string) => {
  return tx?.events
    .find((e) => e.type === eventKey)
    ?.attributes.find((a) => a.key === attrKey)?.value;
};

const mustGetAttr = (tx: IndexedTx, eventKey: string, attrKey: string) => {
  const val = getAttr(tx, eventKey, attrKey);
  if (!val) {
    throw new Error(`Failed to get ${eventKey}.${attrKey}`);
  }
  return val;
};

main();
