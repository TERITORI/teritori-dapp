import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { p2eBackendClient } from "../../utils/backend";
import useSelectedWallet from "../useSelectedWallet";

export const useSeasonRank = () => {
  const selectedWallet = useSelectedWallet();

  const { data: currentSeason } = useQuery(
    ["currentSeason"],
    async () => {
      return await p2eBackendClient.CurrentSeason({});
    },
    { refetchInterval: 300000, staleTime: 300000 }
  );

  const { data: userRank } = useQuery(
    ["userRank", selectedWallet?.address, currentSeason?.id],
    async () => {
      if (!selectedWallet?.address || !currentSeason?.id) return null;
      return await p2eBackendClient.UserRank({
        seasonId: currentSeason.id,
        userId: selectedWallet.address,
      });
    },
    { refetchInterval: 300000, staleTime: 300000 }
  );

  const prettyUserRank = useMemo(
    () => `${userRank?.userScore?.rank || 0}/${userRank?.totalUsers || 0}`,
    [userRank]
  );

  return { userRank, prettyUserRank, currentSeason };
};
