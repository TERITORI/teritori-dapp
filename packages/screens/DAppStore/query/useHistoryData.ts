import { useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../context/WalletsProvider";
import { historyData } from "./userHistoryMock";

export const useMyHistoryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const date = "";
  const { data, refetch } = useQuery(
    ["tickets", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/tickets?addr=${addr}&date=${date}`
        );
        return response.json();
      }
    },
    {
      initialData: historyData,
      refetchOnMount: false,
      enabled: false,
    }
  );
  return { data, refetch };
};
