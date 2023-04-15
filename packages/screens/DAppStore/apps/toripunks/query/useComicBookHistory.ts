import { useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../../../context/WalletsProvider";

export const useComicHistoryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const { data, refetch } = useQuery(
    ["comic-book-data", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/comic/books/history?addr=${addr}`
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: [
        {
          date: "00/0000",
          poolPrice: 0,
          wallets: 0,
        },
      ],
      refetchOnMount: false,
      enabled: false,
    }
  );
  return { data, refetch };
};
