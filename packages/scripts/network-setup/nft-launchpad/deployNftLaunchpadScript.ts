import { Secp256k1HdWallet } from "@cosmjs/amino";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import child_process from "child_process";
import { program } from "commander";
import os from "os";
import path from "path";

import { deployNftLaunchpad } from "./deployNftLaunchpad";

import { TeritoriNameServiceClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import { cosmosNetworkGasPrice, getCosmosNetwork } from "@/networks";
import { zodTryParseJSON } from "@/utils/sanitize";
import { ZodKeyringList } from "@/utils/types/teritorid";

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet-name>", "Wallet to deploy from");
  program.option("<mnemonic>", "The wallet mnemonic");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();

  const [networkId, walletName, mnemonic] = program.args;
  const { keyringBackend } = program.opts();

  try {
    // Getting Cosmos network
    const network = getCosmosNetwork(networkId);
    if (!network) {
      throw new Error(`Cosmos network ${networkId} not found`);
    }
    if (!network.nameServiceContractAddress) {
      throw new Error("Name service contract address not found");
    }

    // Getting signer from mnemonic
    const signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: network.addressPrefix,
    });
    console.log("Restored signer:", signer);

    // Getting deployer wallet address from signer accounts
    const signerAddress = (await signer.getAccounts())[0].address;
    console.log("Signer wallet address:", signerAddress);

    // (To facilitate the script troubleshooting, we control now if the given mnemonic corresponds to the wallet-name)
    // Checking if wallet-name exists in backend keyring
    const keyringCommand = `teritorid keys list --keyring-backend ${keyringBackend} --output json`;
    const keyringListJSON = child_process
      .execSync(keyringCommand, {
        encoding: "utf-8",
      })
      .trim();
    const keyringList = zodTryParseJSON(ZodKeyringList, keyringListJSON);
    if (!keyringList) {
      throw new Error("Failed to parse keyring list");
    }
    // Searching for the wallet with the walletName and check the associated address
    const wallet = keyringList.find((entry) => entry.name === walletName);
    if (wallet && wallet.address === signerAddress) {
      console.log(`Mnemonic corresponds to the wallet name ${walletName}`);
    } else {
      throw new Error(
        `Mnemonic does not correspond to the wallet name ${walletName}`,
      );
    }

    // Getting CW signing client
    const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
      network.rpcEndpoint,
      signer,
      { gasPrice: cosmosNetworkGasPrice(network, "average") },
    );
    const nameServiceClient = new TeritoriNameServiceClient(
      signingCosmWasmClient,
      signerAddress,
      network.nameServiceContractAddress,
    );

    // Deploying CW NFT Launchpad stuff
    await deployNftLaunchpad({
      signingCosmWasmClient,
      nameServiceClient,
      opts: {
        home: path.join(os.homedir(), ".teritorid"),
        binaryPath: "teritorid",
        keyringBackend,
      },
      networkId,
      wallet: walletName,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
main();
