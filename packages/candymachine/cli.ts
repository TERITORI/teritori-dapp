import {
  SigningCosmWasmClient,
  Secp256k1HdWallet,
  GasPrice,
  Decimal,
} from "cosmwasm";
import fs from "fs";
import { stdin, stdout } from "node:process";
import path from "path";
import readline, { Interface as ReadlineInterface } from "readline";

import { TeritoriNftMinterClient } from "../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import { InstantiateMsg } from "../contracts-clients/teritori-nft-minter/TeritoriNftMinter.types";
import { nftStorageUpload } from "./nft-storage-upload";
import { pinataUpload } from "./pinata-upload";
import { StorageResult } from "./storage";

// port of https://github.com/public-awesome/stargaze-tools

const rpcEndpoint = "https://teritorid.65.108.73.219.nip.io:443/rpc";
const minterCodeID = 9;
const tokenCodeID = 6;

const main = async () => {
  // FIXME: validate config

  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "config.json"), "utf-8")
  );

  const rl = readline.createInterface({ input: stdin, output: stdout });

  const wallet = await Secp256k1HdWallet.fromMnemonic(config.walletMnemonic, {
    prefix: "tori",
  });

  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: new GasPrice(Decimal.fromUserInput("0.025", 6), "utori") }
  );

  const accounts = await wallet.getAccounts();
  if (accounts.length <= 0) {
    throw new Error("no accounts");
  }
  const account = accounts[0];
  console.log("👤 Using account", account.address);

  const collectionBytes = fs.readFileSync(
    path.join(__dirname, "collection.json")
  );
  const collection = JSON.parse(collectionBytes.toString("utf8"));

  // FIXME: validate collection json

  // NOTE: we could suggest the correct IPFS gateway in the collection and/or nft metadata

  const storageProvider = await question(
    rl,
    "🏭 Choose a storage provider (NFT.Storage or Pinata): "
  );

  let storageResult: StorageResult;

  switch (storageProvider.toLowerCase()) {
    case "nft.storage":
      storageResult = await nftStorageUpload(config.nftStorageApiToken);
      break;
    case "pinata":
      storageResult = await pinataUpload(
        config.pinataApiKey,
        config.pinataApiSecret
      );
      break;
    default:
      console.error(`❌ Unknown provider "${storageProvider}"`);
      process.exit(1);
  }

  const { baseTokenUri, numTokens } = storageResult;

  // NOTE: might be better to handle this slash thing in the contract code
  const cleanBaseTokenUri = baseTokenUri.endsWith("/")
    ? baseTokenUri
    : baseTokenUri + "/";

  console.log("✍️  Creating mint contract");

  const msg: InstantiateMsg = {
    nft_base_uri: cleanBaseTokenUri,
    nft_ci: tokenCodeID,
    nft_max_supply: `${numTokens}`,
    nft_name: collection.name,
    nft_price_amount: `${collection.unit_price}`,
    nft_symbol: collection.symbol,
    whitelist_mint_period: collection.whitelist_mint_period || 0,
    price_denom: collection.price_denom,
    mint_max: collection.mint_max && `${collection.mint_max}`,
    whitelist_mint_max:
      collection.whitelist_mint_max && `${collection.whitelist_mint_max}`,
  };

  const reply = await client.instantiate(
    account.address,
    minterCodeID,
    msg,
    `Mint-${minterCodeID}-${tokenCodeID} ${msg.nft_name}`,
    "auto"
  );

  console.log(reply);

  const minterClient = new TeritoriNftMinterClient(
    client,
    account.address,
    reply.contractAddress
  );

  if (Array.isArray(collection.whitelist) && collection.whitelist.length) {
    console.log("📜 Adding whitelist");
    const reply = await minterClient.whitelist({ addrs: collection.whitelist });
    console.log(reply);
  }

  console.log("⛏  Starting mint");

  const startMintReply = await minterClient.startMint();

  console.log(startMintReply);

  console.log(
    `✅ Mint started!\nVisit https://testitori.netlify.app/launchpad/collection/${reply.contractAddress}/mint to see your collection live`
  );

  rl.close();
};

main();

const question = (rl: ReadlineInterface, text: string) =>
  new Promise<string>((resolve) => rl.question(text, resolve));
