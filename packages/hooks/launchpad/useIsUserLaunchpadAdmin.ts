
import { useQuery } from "@tanstack/react-query";
import { mustGetDAOClient } from "@/utils/backend";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedWallet } from '@/hooks/useSelectedWallet';
import { useSelectedNetworkId } from '@/hooks/useSelectedNetwork';
import { getKeplrSigningCosmWasmClient } from '@/networks/signer';
import { getNetworkFeature } from '@/networks';
import { NetworkFeature } from '@/networks';
import { NftLaunchpadClient } from '@/contracts-clients/nft-launchpad';

export const useIsUserLaunchpadAdmin = () => {
  const { setToast } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId()
  const selectedWallet = useSelectedWallet()

  if(!selectedWallet) return false

  const { data, ...other } = useQuery<boolean>(
    [
      "isUserLaunchpadAdmin",
      selectedWallet.userId,
      selectedNetworkId
    ],
    async () => {
      try {
        const signingComswasmClient =
        await getKeplrSigningCosmWasmClient(selectedNetworkId);
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        selectedNetworkId,
        NetworkFeature.NFTLaunchpad,
      );
      if (!cosmwasmLaunchpadFeature) return false;
        const daoClient = mustGetDAOClient(selectedNetworkId);
        const nftLaunchpadContractClient = new NftLaunchpadClient(
            signingComswasmClient,
            selectedWallet.walletAddress,
            cosmwasmLaunchpadFeature.launchpadContractAddress,
          );

        if (
          !daoClient
          || !nftLaunchpadContractClient
        ) {
          return false;
        }

        const isUserAdmin = await daoClient.IsUserAdmin(selectedWallet.walletAddress)
        return isUserAdmin

        //TODO: nftLaunchpadContractClient.getConfig to get deployer,
        // then daoClient.IsUserDaoMember

      } catch (e: any) {
        console.error("Error getting launchpad projects: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad projects",
          message: e.message,
        });
        return false
      }
    },
  );
  return { isUserAdmin: data, ...other };
};
