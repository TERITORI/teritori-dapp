import {
  TeritoriMusicPlayerClient,
  TeritoriMusicPlayerQueryClient,
} from "../contracts-clients/teritori-musicplayer/TeritoriMusicPlayer.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface SigningMusicPlayerClientParams {
  networkId: string;
  walletAddress: string;
}

interface NonSigningMusicPlayerClientParams {
  networkId: string;
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

export const nonSigningMusicPlayerClient = async ({
  networkId,
}: NonSigningMusicPlayerClientParams) => {
  const network = mustGetCosmosNetwork(networkId);
  const musicplayerContractAddress = network.musicplayerContractAddress || "";

  const nonSigningCosmWasmClient = await mustGetNonSigningCosmWasmClient(
    networkId
  );

  return new TeritoriMusicPlayerQueryClient(
    nonSigningCosmWasmClient,
    musicplayerContractAddress
  );
};
