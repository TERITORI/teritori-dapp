import { TeritoriVideoPlayerClient } from "../contracts-clients/teritori-video-player/TeritoriVideoPlayer.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface SigningMusicPlayerClientParams {
  networkId: string;
  walletAddress: string;
}

export const signingVideoPlayerClient = async ({
  networkId,
  walletAddress,
}: SigningMusicPlayerClientParams) => {
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
