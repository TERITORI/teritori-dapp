import { OfflineSigner } from "@cosmjs/proto-signing";
import axios from "axios";
import { program } from "commander";
import fs from "fs";
import os from "os";
import path from "path";

import {
  initDeploy,
  instantiateContract,
  instantiateNameService,
  registerTNSHandle,
  storeWASM,
  testTeritoriEcosystem,
} from "./deployLib";

import { CosmosNetworkInfo } from "@/networks";

/**
 * Firstly, store name-service WASM binaries and instantiate name-service contract, if not present on the network
 * Download WASM binaries from https://github.com/DA0-DA0/dao-contracts (We consider using the v2.2.0) and https://github.com/CosmWasm/cw-plus
 * Store these binaries
 * And deploy cw_admin_factory contract
 */
export const deployDA0DA0 = async (
  opts: {
    home: string;
    binaryPath: string;
    keyringBackend?: string;
    signer: OfflineSigner | undefined;
  },
  networkId: string,
  wallet: string,
) => {
  const cosmWasmCwPlusVersion = "v1.1.0";
  const cosmWasmCwPlusBinariesPath = `https://github.com/CosmWasm/cw-plus/releases/download/${cosmWasmCwPlusVersion}`;
  const cw4GroupWasmFileName = "cw4_group.wasm";

  const daoDaoContractsVersion = "v2.2.0";
  const daoDaoContractsBinariesPath = `https://github.com/DA0-DA0/dao-contracts/releases/download/${daoDaoContractsVersion}`;
  const cwAdminFactoryWasmFileName = "cw_admin_factory.wasm";
  const daoDaoCoreWasmFileName = "dao_dao_core.wasm";
  const daoVotingCw4WasmFileName = "dao_voting_cw4.wasm";
  const daoPreProposeSingleWWasmFileName = "dao_pre_propose_single.wasm";
  const daoProposalSingleWasmFileName = "dao_proposal_single.wasm";

  const { network, walletAddr } = await initDeploy({ opts, networkId, wallet });

  if (!network.nameServiceContractAddress) {
    // ========= name-service
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
  }

  // ========= cw4_group
  network.cw4GroupCodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${cosmWasmCwPlusBinariesPath}/${cw4GroupWasmFileName}`,
    cw4GroupWasmFileName,
  );

  // ========= cw_admin_factory
  network.cwAdminFactoryCodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/${cwAdminFactoryWasmFileName}`,
    cwAdminFactoryWasmFileName,
  );
  console.log("Instantiating cw admin factory", network.cwAdminFactoryCodeId);
  network.cwAdminFactoryContractAddress = await instantiateCwAdminFactory(
    opts,
    wallet,
    walletAddr,
    network,
  );

  // ========= dao_dao_core
  network.daoCoreCodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/${daoDaoCoreWasmFileName}`,
    daoDaoCoreWasmFileName,
  );

  // ========= dao_voting_cw4
  network.daoVotingCw4CodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/${daoVotingCw4WasmFileName}`,
    daoVotingCw4WasmFileName,
  );

  // ========= dao_pre_propose_single
  network.daoPreProposeSingleCodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/${daoPreProposeSingleWWasmFileName}`,
    daoPreProposeSingleWWasmFileName,
  );

  // ========= dao_proposal_single
  network.daoProposalSingleCodeId = await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/${daoProposalSingleWasmFileName}`,
    daoProposalSingleWasmFileName,
  );

  console.log(JSON.stringify(network, null, 2));

  if (opts.signer) {
    await registerTNSHandle(network, opts.signer);
    await testTeritoriEcosystem(network);
  }

  return network;
};

const instantiateCwAdminFactory = async (
  opts: { home: string; binaryPath: string; keyringBackend?: string },
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.cwAdminFactoryCodeId;
  if (!codeId) {
    throw new Error("CW Admin Factory code ID not found");
  }
  return await instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori CW Admin Factory",
    {},
  );
};

const deployRemoteWASM = async (
  opts: { home: string; binaryPath: string; signer: OfflineSigner | undefined },
  wallet: string,
  network: CosmosNetworkInfo,
  url: string,
  name: string,
) => {
  console.log(`Fetching ${url}`);
  const contractsDir = path.join(opts.home, "remote-wasm");
  fs.mkdirSync(contractsDir, { recursive: true });
  const filePath = path.join(contractsDir, name);
  const response = await axios.get(url, { responseType: "stream" });
  const fileStream = fs.createWriteStream(filePath);
  await response.data.pipe(fileStream);
  console.log(`Storing ${filePath}`);
  return await storeWASM(opts, wallet, network, filePath);
};

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet] = program.args;
  const { keyringBackend } = program.opts();

  await deployDA0DA0(
    {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
      signer: undefined,
    },
    networkId,
    wallet,
  );
};
main();
