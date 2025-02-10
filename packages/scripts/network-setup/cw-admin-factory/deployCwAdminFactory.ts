import path from "path";

import { CosmosNetworkInfo } from "@/networks";
import {
  instantiateContract,
  storeWASM,
  initDeploy,
} from "@/scripts/network-setup/deployLib";

export const deployCwAdminFactory = async ({
  opts,
  networkId,
  wallet,
}: {
  networkId: string;
  wallet: string;
  opts: { home: string; binaryPath: string; keyringBackend?: string };
}) => {
  const { network, walletAddr: deployerWalletAddress } = await initDeploy({
    opts,
    networkId,
    wallet,
  });

  console.log("Storing CW Admin Factory");
  const nftLaunchpadWasmFilePath = path.join(
    __dirname,
    "../../../artifacts/cw_admin_factory.wasm",
  );
  network.cwAdminFactoryCodeId = await storeWASM(
    opts,
    wallet,
    network,
    nftLaunchpadWasmFilePath,
  );

  console.log("Instantiating CW Admin Factory", network.cwAdminFactoryCodeId);
  network.cwAdminFactoryContractAddress = await instantiateCwAdminFactory(
    opts,
    wallet,
    deployerWalletAddress,
    network,
  );

  console.log(JSON.stringify(network, null, 2));
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
