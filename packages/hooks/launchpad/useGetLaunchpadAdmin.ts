import { useQuery } from "@tanstack/react-query";

import { useSelectedNetworkId } from "./../useSelectedNetwork";
import useSelectedWallet from "./../useSelectedWallet";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { getNetworkFeature, NetworkFeature, getUserId } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const useGetLaunchpadAdmin = () => {
  const selectedWallet = useSelectedWallet();
  const userAddress = selectedWallet?.address;
  const selectedNetworkId = useSelectedNetworkId();
  const { setToast } = useFeedbacks();

  const { data, ...other } = useQuery<string | undefined>(
    ["getLaunchpadAdmin", userAddress, selectedNetworkId],
    async () => {
      try {
        if (!userAddress) {
          throw Error("No user address");
        }
        const signingComswasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const cosmwasmNftLaunchpadFeature = getNetworkFeature(
          selectedNetworkId,
          NetworkFeature.CosmWasmNFTLaunchpad,
        );

        if (!cosmwasmNftLaunchpadFeature) {
          throw Error("No Launchpad feature");
        }

        const nftLaunchpadContractClient = new NftLaunchpadClient(
          signingComswasmClient,
          userAddress,
          cosmwasmNftLaunchpadFeature.launchpadContractAddress,
        );

        if (!nftLaunchpadContractClient) {
          throw Error("Launchpad contract client not found");
        }

        // The Launchapd Admin DAO is the deployer set in the config of the nft-launchpad contract
        const config = await nftLaunchpadContractClient.getConfig();
        if (!config.admin) {
          throw Error("No Launchpad admin set");
        }

        const adminDaoId = getUserId(selectedNetworkId, config.admin);

        return adminDaoId;
      } catch (e: any) {
        console.error("Error getting Launchpad admin: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting Launchpad admin",
          message: e.message,
        });
      }
    },
    {
      enabled: !!userAddress,
    },
  );
  return { launchpadAdminId: data, ...other };
};
