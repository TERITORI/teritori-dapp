import { useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../../../context/WalletsProvider";

export const useGiganticLastReward = () => {
  const { data, refetch } = useQuery(
    ["GiganticlastRewards"],
    async () => {
      try {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/gigantic/lottery/history/last/rewards`,
        );
        return response.json();
      } catch (e) {
        return e;
      }
    },
    {
      initialData: {
        last_rewards: 0,
      },
      refetchOnMount: false,
      enabled: false,
    },
  );
  return { data: data.last_rewards, refetch };
};

export const useGiganticHistoryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const { data, refetch } = useQuery(
    ["GiganticHistoryData", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/gigantic/lottery/history?addr=${addr}`,
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: [
        {
          date: "00/0000",
          toriWon: 0,
        },
      ],
      refetchOnMount: false,
      enabled: false,
    },
  );
  return { data, refetch };
};
