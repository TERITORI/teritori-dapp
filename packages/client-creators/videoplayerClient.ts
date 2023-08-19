import {
  TeritoriVideoPlayerClient,
  TeritoriVideoPlayerQueryClient,
} from "../contracts-clients/teritori-video-player/TeritoriVideoPlayer.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface SigningClientParams {
  networkId: string;
  walletAddress: string;
}

interface NonSigningClientParams {
  networkId: string;
}

export const signingVideoPlayerClient = async ({
  networkId,
  walletAddress,
}: SigningClientParams) => {
  const network = mustGetCosmosNetwork(networkId);
  const videoContractAddress = network.videoContractAddress || "";

  const cachedSigningClients: { [key: string]: TeritoriVideoPlayerClient } = {};
  const cacheKey = `${walletAddress}${videoContractAddress}`;

  if (cachedSigningClients[cacheKey]) {
    return cachedSigningClients[cacheKey];
  } else {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      networkId
    );
    const client = new TeritoriVideoPlayerClient(
      signingComswasmClient,
      walletAddress,
      videoContractAddress
    );

    cachedSigningClients[cacheKey] = client;
    return client;
  }
};

export const nonSigningVideoPlayerClient = async ({
  networkId,
}: NonSigningClientParams) => {
  const network = mustGetCosmosNetwork(networkId);
  const videoContractAddress = network.videoContractAddress || "";

  const nonSigningCosmWasmClient = await mustGetNonSigningCosmWasmClient(
    networkId
  );

  return new TeritoriVideoPlayerQueryClient(
    nonSigningCosmWasmClient,
    videoContractAddress
  );
};
