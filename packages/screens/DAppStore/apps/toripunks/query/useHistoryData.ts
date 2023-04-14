import { useQuery } from "@tanstack/react-query";

import { historyData } from "./userHistoryMock";
import { Wallet } from "../../../../../context/WalletsProvider";

export const useMyHistoryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const date = new Date().toISOString().slice(0, 10);
  const { data, refetch } = useQuery(
    ["tickets", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/tickets?addr=${addr}&date=${date}`
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: historyData,
      refetchOnMount: false,
      enabled: false,
    }
  );
  return { data, refetch };
};
export const useMyHistoryComicData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const date = new Date().toISOString().slice(0, 10);
  const { data, refetch } = useQuery(
    ["tickets", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/comic/books/history?addr=${addr}&date=${date}`
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: historyData,
      refetchOnMount: false,
      enabled: false,
    }
  );
  return { data, refetch };
};

export const useMyHistoryLotteryData = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}) => {
  const addr = selectedWallet?.address || "";
  const date = new Date().toISOString().slice(0, 10);
  const { data, refetch } = useQuery(
    ["tickets", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/gigantic/lottery/history?addr=${addr}&date=${date}`
        );
        return response.json();
      }
      return [];
    },
    {
      initialData: historyData,
      refetchOnMount: false,
      enabled: false,
    }
  );
  return { data, refetch };
};
