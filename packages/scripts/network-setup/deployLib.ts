import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { IndexedTx } from "@cosmjs/stargate";
import { Attribute, Event } from "@cosmjs/stargate/build/events";
import { bech32 } from "bech32";
import _, { cloneDeep } from "lodash";
import path from "path";

import { instantiateNftLaunchpad } from "./deployNftLaunchpad";
import { InstantiateMsg as MarketplaceVaultInstantiateMsg } from "../../contracts-clients/nft-marketplace/NftMarketplace.types";
import {
  ExecuteMsg as NameServiceExecuteMsg,
  InstantiateMsg as NameServiceInstantiateMsg,
  Metadata,
} from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { InstantiateMsg as SocialFeedInstantiateMsg } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { execPromise, injectRPCPort, retry, sleep, zodTxResult } from "../lib";
import sqh from "../sqh";

import {
  TeritoriNameServiceClient,
  TeritoriNameServiceQueryClient,
} from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  cosmosNetworkGasPrice,
  CosmosNetworkInfo,
  getCosmosNetwork,
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
  NetworkFeature,
} from "@/networks";
import { zodTryParseJSON } from "@/utils/sanitize";

export interface DeployOpts {
  home: string;
  binaryPath: string;
  signer?: OfflineSigner;
  keyringBackend?: string;
}

export const initDeploy = async ({
  opts,
  networkId,
  wallet,
}: {
  opts: DeployOpts;
  networkId: string;
  wallet: string;
}) => {
  const network = cloneDeep(getCosmosNetwork(networkId));
  if (!network) {
    console.error(`Cosmos network ${networkId} not found`);
    process.exit(1);
  }
  console.log(`Deploying to ${network.displayName}`);

  let walletAddr = (
    await execPromise(
      `${opts.binaryPath} keys show --keyring-backend test -a ${wallet} --home ${opts.home}`,
      { encoding: "utf-8" },
    )
  ).stdout.trim();
  if (walletAddr.startsWith("Successfully migrated")) {
    walletAddr = walletAddr.substring(walletAddr.indexOf("\n")).trim();
  }
  bech32.decode(walletAddr);

  console.log("Wallet address:", walletAddr);

  return { network, walletAddr };
};

export const deployTeritoriEcosystem = async (
  opts: DeployOpts,
  networkId: string,
  wallet: string,
) => {
  const { network, walletAddr } = await initDeploy({ opts, networkId, wallet });
  console.log("Wallet address:", walletAddr);

  console.log("Storing name service");
  const nameServiceWasmFilePath = path.join(__dirname, "name-service.wasm");
  network.nameServiceCodeId = await storeWASM(
    opts,
    wallet,
    network,
    nameServiceWasmFilePath,
  );

  console.log("Instantiating name service", network.nameServiceCodeId);
  network.nameServiceContractAddress = await instantiateNameService(
    opts,
    wallet,
    walletAddr,
    network,
  );

  console.log("Storing social feed");
  const socialFeedWasmFilePath = path.join(__dirname, "social-feed.wasm");
  network.socialFeedCodeId = await storeWASM(
    opts,
    wallet,
    network,
    socialFeedWasmFilePath,
  );

  console.log("Instantiating social feed", network.socialFeedCodeId);
  network.socialFeedContractAddress = await instantiateSocialFeed(
    opts,
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
    opts,
    wallet,
    network,
    marketplaceVaultWasmFilePath,
  );

  console.log(
    "Instantiating marketplace vault",
    network.marketplaceVaultCodeId,
  );
  network.vaultContractAddress = await instantiateMarketplaceVault(
    opts,
    wallet,
    walletAddr,
    network,
  );

  console.log("Instantiating NFT Launchpad", network.nameServiceCodeId);
  const cosmwasmNftLaunchpadFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.CosmWasmNFTLaunchpad),
  );
  if (!cosmwasmNftLaunchpadFeature) {
    console.error(`Cosmwasm Launchpad feature not found on ${networkId}`);
  } else {
    cosmwasmNftLaunchpadFeature.launchpadContractAddress =
      await instantiateNftLaunchpad(
        opts,
        wallet,
        walletAddr,
        "TODO DAO address",
        network,
        cosmwasmNftLaunchpadFeature,
      );
  }

  if (opts.signer) {
    await registerTNSHandle(network, opts.signer);
    await testTeritoriEcosystem(network);
  }

  return network;
};

const goldenName = "testing.tori";

const goldenMetadata: Metadata = {
  contract_address: "0x1234abcd5678efgh9012ijkl3456mnop",
  discord_id: "123456789012345678",
  email: "example@email.com",
  external_url: "https://www.example.com",
  image: "https://www.example.com/image.png",
  image_data: null,
  keybase_id: "keybaseUser1",
  parent_token_id: null,
  pgp_public_key: null,
  public_bio: "This is a sample biography.",
  public_name: "John Doe",
  public_profile_header: "Header Information",
  telegram_id: "telegramUser1",
  twitter_id: "twitterUser1",
  validator_operator_address: null,
};

export const registerTNSHandle = async (
  network: CosmosNetworkInfo,
  signer: OfflineSigner,
) => {
  console.log("🙋🏽‍♀️ Registering TNS handle");
  if (!network.nameServiceContractAddress) {
    throw new Error("Name service contract address not found");
  }
  const cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    network.rpcEndpoint,
    signer,
    { gasPrice: cosmosNetworkGasPrice(network, "average") },
  );
  const senderAddress = (await signer.getAccounts())[0].address;
  const nameServiceClient = new TeritoriNameServiceClient(
    cosmWasmClient,
    senderAddress,
    network.nameServiceContractAddress,
  );
  await nameServiceClient.mint({
    tokenId: goldenName,
    extension: goldenMetadata,
    owner: senderAddress,
  });
  console.log("✅ TNS handle registered");
};

export const testTeritoriEcosystem = async (network: CosmosNetworkInfo) => {
  console.log("🧪 Testing Teritori ecosystem");
  if (!network.nameServiceContractAddress) {
    throw new Error("Name service contract address not found");
  }
  const cosmWasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  const nameServiceClient = new TeritoriNameServiceQueryClient(
    cosmWasmClient,
    network.nameServiceContractAddress,
  );
  const nameServiceInfo = await nameServiceClient.nftInfo({
    tokenId: goldenName,
  });
  if (!_.isEqual(nameServiceInfo.extension, goldenMetadata)) {
    throw new Error(
      "Metadata does not match\n" +
        JSON.stringify(nameServiceInfo.extension, null, 2),
    );
  }
  console.log("✅ Name service metadata matches");
};

const instantiateMarketplaceVault = (
  opts: DeployOpts,
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.marketplaceVaultCodeId;
  if (!codeId) {
    throw new Error("Code ID not found");
  }
  const instantiateMsg: MarketplaceVaultInstantiateMsg = { fee_bp: "5" };
  return instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori Marketplace Vault",
    instantiateMsg,
  );
};

const instantiateSocialFeed = async (
  opts: DeployOpts,
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.socialFeedCodeId;
  if (!codeId) {
    throw new Error("Social feed code ID not found");
  }
  const instantiateMsg: SocialFeedInstantiateMsg = {};
  return await instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori Social Feed",
    instantiateMsg,
  );
};

export const instantiateNameService = async (
  opts: DeployOpts,
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
    opts,
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
  const cmd = `${opts.binaryPath} tx wasm execute ${addr} ${sqh(
    JSON.stringify(feesMsg),
  )} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend test -o json --home ${opts.home}`;
  console.log("⚙️  " + cmd);
  let { stdout: out } = await retry(5, async () => {
    return await execPromise(cmd, {
      encoding: "utf-8",
    });
  });
  if (!out.startsWith("{")) {
    out = out.substring(out.indexOf("{"));
  }
  const outObj = zodTryParseJSON(zodTxResult, out.toString());
  if (!outObj) {
    throw new Error("Failed to parse instantiate result");
  }
  await getTx(network.id, outObj.txhash);
  return addr;
};

export const instantiateContract = async (
  opts: DeployOpts,
  wallet: string,
  network: CosmosNetworkInfo,
  codeId: number,
  admin: string,
  label: string,
  msg: unknown,
) => {
  const cmd = `${opts.binaryPath} tx wasm instantiate ${codeId} ${sqh(
    JSON.stringify(msg),
  )} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend ${opts.keyringBackend || "test"} -o json --label ${sqh(
    label,
  )} --admin ${admin} --home ${opts.home}`;
  console.log("⚙️  " + cmd);
  let { stdout: out } = await retry(
    5,
    async () =>
      await execPromise(cmd, {
        encoding: "utf-8",
      }),
  );
  if (!out.startsWith("{")) {
    out = out.substring(out.indexOf("{"));
  }
  const outObj = zodTryParseJSON(zodTxResult, out);
  if (!outObj) {
    throw new Error("Failed to parse instantiate result");
  }
  const tx = await getTx(network.id, outObj.txhash);
  return mustGetAttr(tx, "instantiate", "_contract_address");
};

export const storeWASM = async (
  opts: DeployOpts,
  wallet: string,
  network: CosmosNetworkInfo,
  wasmFilePath: string,
) => {
  const cmd = `${
    opts.binaryPath
  } tx wasm store ${wasmFilePath} --from ${wallet} --gas auto --gas-adjustment 1.5 --broadcast-mode sync --chain-id ${
    network.chainId
  } --node ${injectRPCPort(
    network.rpcEndpoint,
  )} --yes --keyring-backend ${opts.keyringBackend || "test"} -o json --home ${opts.home}`;
  console.log("⚙️  " + cmd);
  let { stdout: out } = await retry(5, async () => {
    return await execPromise(cmd, {
      encoding: "utf-8",
    });
  });
  if (!out.startsWith("{")) {
    out = out.substring(out.indexOf("{"));
  }
  const outObj = zodTryParseJSON(zodTxResult, out);
  if (!outObj) {
    throw new Error("Failed to parse store result");
  }
  const { txhash } = outObj;
  const tx = await getTx(network.id, txhash);
  const codeId = mustGetAttr(tx, "store_code", "code_id");
  return +codeId;
};

const getTx = async (networkId: string, txhash: string, timeout?: number) => {
  const innerGetTx = async () => {
    let tx: IndexedTx | null = null;
    while (tx === null) {
      tx = await retry(5, async () => {
        const client = await mustGetNonSigningCosmWasmClient(networkId);
        return client.getTx(txhash);
      });
      await sleep(1000);
    }
    return tx;
  };
  const startTimeout = async () => {
    await sleep(timeout || 20000);
    return undefined;
  };
  console.log("⏳ Waiting for tx '" + txhash + "'");
  const tx = await Promise.race([startTimeout(), innerGetTx()]);
  if (!tx) {
    throw new Error("Timed out waiting for tx '" + txhash + "'");
  }
  if (tx.code !== 0) {
    throw new Error(
      "Tx '" +
        txhash +
        "' failed with code " +
        tx.code +
        "\n" +
        JSON.stringify(tx, null, 2),
    );
  }
  console.log("Tx '" + txhash + "' found");
  return tx;
};

const getAttr = (tx: IndexedTx, eventKey: string, attrKey: string) => {
  return tx?.events
    .find((e: Event) => e.type === eventKey)
    ?.attributes.find((a: Attribute) => a.key === attrKey)?.value;
};

const mustGetAttr = (tx: IndexedTx, eventKey: string, attrKey: string) => {
  const val = getAttr(tx, eventKey, attrKey);
  if (!val) {
    throw new Error(`Failed to get ${eventKey}.${attrKey}`);
  }
  return val;
};
