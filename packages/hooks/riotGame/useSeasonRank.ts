import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "../../networks";
import { getP2eClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

export const useSeasonRank = () => {
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();

  const { data: currentSeason } = useQuery(
    ["currentSeason", networkId],
    async () => {
      const client = getP2eClient(networkId);
      if (!client) {
        return null;
      }
      return await client.CurrentSeason({});
    },
    { refetchInterval: 300000, staleTime: 300000 },
  );

  const { data: userRank } = useQuery(
    ["userRank", selectedWallet?.userId, currentSeason?.id],
    async () => {
      const [network, userAddress] = parseUserId(selectedWallet?.userId);
      if (!network || !userAddress || !currentSeason?.id) return null;
      const client = getP2eClient(network.id);
      if (!client) {
        return null;
      }
      return await client.UserRank({
        seasonId: currentSeason.id,
        userId: selectedWallet?.userId, // FIXME: is it safe to change this id shape mid-season?
      });
    },
    { refetchInterval: 300000, staleTime: 300000 },
  );

  const prettyUserRank = `${userRank?.userScore?.rank || 0}/${
    userRank?.totalUsers || 0
  }`;

  return { userRank, prettyUserRank, currentSeason };
};
