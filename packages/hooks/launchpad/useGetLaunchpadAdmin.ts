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

  const { data, ...other } = useQuery<string>(
    ["getLaunchpadAdmin", userAddress, selectedNetworkId],
    async () => {
      try {
        if (!userAddress) {
          throw Error("No user address");
        }
        const signingComswasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const cosmwasmLaunchpadFeature = getNetworkFeature(
          selectedNetworkId,
          NetworkFeature.NFTLaunchpad,
        );

        if (!cosmwasmLaunchpadFeature) {
          throw Error("No Launchpad feature");
        }

        const nftLaunchpadContractClient = new NftLaunchpadClient(
          signingComswasmClient,
          userAddress,
          cosmwasmLaunchpadFeature.launchpadContractAddress,
        );

        if (!nftLaunchpadContractClient) {
          throw Error("Launchpad contract client not found");
        }

        // The Launchapd Admin DAO is the deployer set in the config of the nft-launchpad contract
        const config = await nftLaunchpadContractClient.getConfig();
        if (!config.deployer) {
          throw Error("No Launchpad admin set");
        }

        const adminDaoId = getUserId(selectedNetworkId, config.deployer);

        return adminDaoId;
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
      enabled: !!userAddress,
    },
  );
  return { launchpadAdminId: data, ...other };
};
