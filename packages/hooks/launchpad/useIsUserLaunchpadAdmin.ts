import { useQuery } from "@tanstack/react-query";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import {
  getNetworkFeature,
  parseUserId,
  NetworkFeature,
  getUserId,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { mustGetDAOClient } from "@/utils/backend";

export const useIsUserLaunchpadAdmin = (userId?: string) => {
  const { setToast } = useFeedbacks();

  const { data, ...other } = useQuery<boolean>(
    ["isUserLaunchpadAdmin", userId],
    async () => {
      try {
        const [network, userAddress] = parseUserId(userId);
        if (!userId) {
          throw new Error("Invalid sender");
        }
        if (!network) {
          throw new Error("Invalid network");
        }
        const networkId = network.id;

        const signingComswasmClient =
          await getKeplrSigningCosmWasmClient(networkId);
        const cosmwasmLaunchpadFeature = getNetworkFeature(
          networkId,
          NetworkFeature.NFTLaunchpad,
        );

        if (!cosmwasmLaunchpadFeature) {
          throw new Error("No Launchpad feature");
        }

        const daoClient = mustGetDAOClient(networkId);
        const nftLaunchpadContractClient = new NftLaunchpadClient(
          signingComswasmClient,
          userAddress,
          cosmwasmLaunchpadFeature.launchpadContractAddress,
        );

        if (!daoClient) {
          throw new Error("DAO client not found");
        }
        if (!nftLaunchpadContractClient) {
          throw new Error("Launchpad contract client not found");
        }

        // The Launchapd Admin DAO is the deployer set in the config of the nft-launchpad contract
        const config = await nftLaunchpadContractClient.getConfig();
        if (!config.launchpad_admin) {
          throw new Error("No Launchpad admin set");
        }

        const adminDaoId = getUserId(networkId, config.launchpad_admin);
        const { isMember } = await daoClient.IsUserDAOMember({
          userId,
          daoId: adminDaoId,
        });

        return isMember;
      } catch (e: any) {
        console.error("Error veryfing Launchpad admin: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error veryfing Launchpad admin",
          message: e.message,
        });
        return false;
      }
    },
    {
      enabled: !!userId,
    },
  );
  return { isUserLaunchpadAdmin: data, ...other };
};
