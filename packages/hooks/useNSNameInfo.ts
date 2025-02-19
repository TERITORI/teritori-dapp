import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { NftInfoResponse } from "@/contracts-clients/teritori-name-service/TeritoriNameService.types";
import {
  CosmosNetworkInfo,
  GnoNetworkInfo,
  NetworkKind,
  getNetwork,
} from "@/networks";
import { getCosmosNameServiceQueryClient } from "@/utils/contracts";
import { derivePkgAddr, extractGnoString } from "@/utils/gno";
import { ProfileData } from "@/utils/upp";

export const GNO_CONTRACT_FIELD = {
  DISPLAY_NAME: "DisplayName",
  BIO: "Bio",
  AVATAR: "Avatar",
  // NOTE: These fields below are extra for now but can become standard fields later
  BANNER: "Banner",
};

const gnoGetNSNameInfo = async (
  network: GnoNetworkInfo,
  addressOrName: string,
) => {
  if (!addressOrName) return null;

  // DAO User

  // Single User
  let address: string | null = addressOrName;
  // If aon is username then get the address
  if (addressOrName.startsWith("gno.land/")) {
    address = derivePkgAddr(addressOrName);
  } else if (addressOrName.endsWith(".gno")) {
    address = await gnoGetAddressByUsername(
      network,
      addressOrName.slice(0, -".gno".length),
    );

    if (!address) return;
  }

  const profile = await gnoGetUserProfile(network, address);

  const res: NftInfoResponse = {
    extension: {
      public_bio: profile.bio,
      public_name: profile.displayName,
      image: profile.avatarURL,
      public_profile_header: profile.bannerURL,
    },
  };
  return res;
};

const cosmosGetNSNameInfo = async (
  network: CosmosNetworkInfo,
  tokenId: string,
) => {
  if (!tokenId) return null;

  const nsClient = await getCosmosNameServiceQueryClient(network.id);
  if (!nsClient) {
    return null;
  }

  let nftInfo;

  try {
    nftInfo = await nsClient.nftInfo({
      tokenId,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      return null;
    }
    throw err;
  }

  return nftInfo;
};

export const nsNameInfoQueryKey = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
) => ["nsNameInfo", networkId, tokenId];

export const useNSNameInfo = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
  enabled?: boolean,
) => {
  const { data: nsInfo, ...other } = useQuery(
    nsNameInfoQueryKey(networkId, tokenId),
    async () => {
      if (!tokenId) return null;

      const network = getNetwork(networkId);
      if (!network) return null;

      switch (network?.kind) {
        case NetworkKind.Cosmos:
          return cosmosGetNSNameInfo(network, tokenId);
        case NetworkKind.Gno:
          return gnoGetNSNameInfo(network, tokenId);
        default:
          throw Error(`unsupported network kind: ${network.kind}`);
      }
    },
    { staleTime: Infinity, enabled },
  );
  return { nsInfo, notFound: !nsInfo, ...other };
};

const gnoGetUserProfile = async (network: GnoNetworkInfo, address: string) => {
  const provider = new GnoJSONRPCProvider(network?.endpoint);
  const { profilePkgPath } = network;
  if (!profilePkgPath) {
    throw Error("profilePkgPath is not given");
  }

  const profileFields = [
    GNO_CONTRACT_FIELD.DISPLAY_NAME,
    GNO_CONTRACT_FIELD.BIO,
    GNO_CONTRACT_FIELD.AVATAR,
    GNO_CONTRACT_FIELD.BANNER,
  ];

  const promises = profileFields.map((field) =>
    provider.evaluateExpression(
      profilePkgPath,
      `GetStringField("${address}","${field}","")`,
    ),
  );
  const dataRaw = await Promise.all(promises);
  const extractedData = dataRaw.map(extractGnoString);

  const profile: ProfileData = {
    displayName: extractedData[0],
    bio: extractedData[1],
    avatarURL: extractedData[2],
    bannerURL: extractedData[3],
  };
  return profile;
};

const gnoGetAddressByUsername = async (
  network: GnoNetworkInfo,
  name: string,
) => {
  if (!name) return null;

  const provider = new GnoJSONRPCProvider(network.endpoint);

  try {
    const res = await provider.evaluateExpression(
      network.nameServiceContractAddress,
      `GetUserByName(${JSON.stringify(name)}).Address`,
    );
    const address = extractGnoString(res);
    return address;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("ABCI response is not initialized")
    ) {
      // not registered
      return null;
    }
    throw err;
  }
};
