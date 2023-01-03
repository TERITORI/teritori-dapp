import { useEffect, useMemo, useState } from "react";

import { CurrentSeasonResponse, UserRankResponse } from "../../api/p2e/v1/p2e";
import { p2eBackendClient } from "../../utils/backend";
import useSelectedWallet from "../useSelectedWallet";

export const useSeasonRank = () => {
  const selectedWallet = useSelectedWallet();
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();
  const [userRank, setUserRank] = useState<UserRankResponse>();

  useEffect(() => {
    if (!currentSeason?.id || !selectedWallet?.address) return;
    const effect = async () => {
      const userRank = await fetchUserRank(
        selectedWallet.address,
        currentSeason.id
      );
      setUserRank(userRank);
    };
    effect();
  }, [selectedWallet?.address, currentSeason?.id]);

  useEffect(() => {
    const effect = async () => {
      const currentSeason = await fetchCurrentSeason();
      setCurrentSeason(currentSeason);
    };
    effect();
  }, []);

  const prettyUserRank = useMemo(
    () => `${userRank?.userScore?.rank || 0}/${userRank?.totalUsers || 0}`,
    [userRank]
  );

  const fetchCurrentSeason = async () => {
    return await p2eBackendClient.CurrentSeason({});
  };

  const fetchUserRank = async (userId: string, seasonId: string) => {
    try {
      return await p2eBackendClient.UserRank({
        seasonId,
        userId,
      });
    } catch (e) {
      console.log("Unable to fetch rank:", e);
    }
  };

  return { userRank, prettyUserRank, currentSeason };
};
