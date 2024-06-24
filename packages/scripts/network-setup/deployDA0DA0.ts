import { OfflineSigner } from "@cosmjs/proto-signing";
import axios from "axios";
import { bech32 } from "bech32";
import fs from "fs";
import { cloneDeep } from "lodash";
import path from "path";

import {
  instantiateContract,
  instantiateNameService,
  registerTNSHandle,
  storeWASM,
  testTeritoriEcosystem,
} from "./deployLib";

import { CosmosNetworkInfo, getCosmosNetwork } from "@/networks";
import { execPromise } from "@/scripts/lib";

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

/**
 * Firstly, store name-service WASM binaries and instantiate name-service contract, if not present on the network
 * Download WASM binaries from https://github.com/DA0-DA0/dao-contracts (We consider using the v2.2.0) and https://github.com/CosmWasm/cw-plus
 * Store these binaries
 * And deploy cw_admin_factory contract
 */
const deployDA0DA0 = async (
  opts: { home: string; binaryPath: string; signer: OfflineSigner | undefined },
  networkId: string,
  wallet: string,
) => {
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
  console.log("Fetching cw4 group");
  await downloadFileFromUrl(
    `${cosmWasmCwPlusBinariesPath}/${cw4GroupWasmFileName}`,
    cw4GroupWasmFileName,
  );
  const cw4GroupWasmFilePath = path.join(__dirname, cw4GroupWasmFileName);
  console.log("Storing cw4 group");
  network.cw4GroupCodeId = await storeWASM(
    opts,
    wallet,
    network,
    cw4GroupWasmFilePath,
  );

  // ========= cw_admin_factory
  console.log("Fetching cw admin factory");
  await downloadFileFromUrl(
    `${daoDaoContractsBinariesPath}/${cwAdminFactoryWasmFileName}`,
    cwAdminFactoryWasmFileName,
  );
  const cwAdminFactoryWasmFilePath = path.join(
    __dirname,
    cwAdminFactoryWasmFileName,
  );
  console.log("Storing cw admin factory");
  network.cwAdminFactoryCodeId = await storeWASM(
    opts,
    wallet,
    network,
    cwAdminFactoryWasmFilePath,
  );
  console.log("Instantiating cw admin factory", network.cwAdminFactoryCodeId);
  network.cwAdminFactoryContractAddress = await instantiateCwAdminFactory(
    opts,
    wallet,
    walletAddr,
    network,
  );

  // ========= dao_dao_core
  console.log("Fetching dao dao core");
  await downloadFileFromUrl(
    `${daoDaoContractsBinariesPath}/${daoDaoCoreWasmFileName}`,
    daoDaoCoreWasmFileName,
  );
  const daoDaoCoreWasmFilePath = path.join(__dirname, daoDaoCoreWasmFileName);
  console.log("Storing dao dao core");
  network.daoCoreCodeId = await storeWASM(
    opts,
    wallet,
    network,
    daoDaoCoreWasmFilePath,
  );

  // ========= dao_voting_cw4
  console.log("Fetching dao voting cw4");
  await downloadFileFromUrl(
    `${daoDaoContractsBinariesPath}/${daoVotingCw4WasmFileName}`,
    daoVotingCw4WasmFileName,
  );
  const daoVotingCw4WasmFilePath = path.join(
    __dirname,
    daoVotingCw4WasmFileName,
  );
  console.log("Storing dao voting cw4");
  network.daoVotingCw4CodeId = await storeWASM(
    opts,
    wallet,
    network,
    daoVotingCw4WasmFilePath,
  );

  // ========= dao_pre_propose_single
  console.log("Fetching dao voting cw4");
  await downloadFileFromUrl(
    `${daoDaoContractsBinariesPath}/${daoPreProposeSingleWWasmFileName}`,
    daoPreProposeSingleWWasmFileName,
  );
  const daoPreProposeSingleWasmFilePath = path.join(
    __dirname,
    daoPreProposeSingleWWasmFileName,
  );
  console.log("Storing dao pre propose single");
  network.daoPreProposeSingleCodeId = await storeWASM(
    opts,
    wallet,
    network,
    daoPreProposeSingleWasmFilePath,
  );

  // ========= dao_proposal_single
  console.log("Fetching dao voting cw4");
  await downloadFileFromUrl(
    `${daoDaoContractsBinariesPath}/${daoProposalSingleWasmFileName}`,
    daoProposalSingleWasmFileName,
  );
  const daoProposalSingleWasmFilePath = path.join(
    __dirname,
    daoProposalSingleWasmFileName,
  );
  console.log("Storing dao proposal single");
  network.daoProposalSingleCodeId = await storeWASM(
    opts,
    wallet,
    network,
    daoProposalSingleWasmFilePath,
  );

  console.log(JSON.stringify(network, null, 2));

  if (opts.signer) {
    await registerTNSHandle(network, opts.signer);
    await testTeritoriEcosystem(network);
  }

  return network;
};

const instantiateCwAdminFactory = async (
  opts: { home: string; binaryPath: string },
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

const downloadFileFromUrl = async (url: string, fileName: string) => {
  const response = await axios.get(url, { responseType: "stream" });
  const fileStream = fs.createWriteStream(path.join(__dirname, fileName));
  await response.data.pipe(fileStream);
};

export default deployDA0DA0;
