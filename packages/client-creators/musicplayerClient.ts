import { TeritoriMusicPlayerClient } from "../contracts-clients/teritori-music-player/TeritoriMusicPlayer.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface SigningMusicPlayerClientParams {
  networkId: string;
  walletAddress: string;
}

export const signingMusicPlayerClient = async ({
  networkId,
  walletAddress,
}: SigningMusicPlayerClientParams) => {
  const network = mustGetCosmosNetwork(networkId);
  const musicplayerContractAddress = network.musicplayerContractAddress || "";

  const cachedSigningClients: { [key: string]: TeritoriMusicPlayerClient } = {};
  const cacheKey = `${walletAddress}${musicplayerContractAddress}`;

  if (cachedSigningClients[cacheKey]) {
    return cachedSigningClients[cacheKey];
  } else {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      networkId
    );
    const client = new TeritoriMusicPlayerClient(
      signingComswasmClient,
      walletAddress,
      musicplayerContractAddress
    );

    cachedSigningClients[cacheKey] = client;
    return client;
  }
};
