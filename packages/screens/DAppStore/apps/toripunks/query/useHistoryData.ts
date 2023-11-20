import { useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../../../context/WalletsProvider";

export const useMyHistoryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const date = "2023-04-14"; //new Date().toISOString().slice(0, 10);
  const { data, refetch } = useQuery(
    ["history", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/tickets?addr=${addr}&date=${date}`,
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: [
        {
          date: "00/0000",
          tickets: {
            bought: 0,
            won: 0,
          },
          toriWon: 0,
        },
      ],
      refetchOnMount: false,
      enabled: false,
    },
  );
  return { data, refetch };
};
