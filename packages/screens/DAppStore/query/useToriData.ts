import { useMutation, useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../context/WalletsProvider/wallet";
import { getCodeError } from "./codeError";

const addr = "tori1xdtdctdedst45u8c8fmxutg8vvltyg5ezpdycz";

export const useList = ({
  selectedWallet,
}: {
  selectedWallet?: Wallet;
}): number[] | number => {
  //   const addr = selectedWallet?.address || "";
  const { data } = useQuery(
    ["toripunks", addr],
    async () => {
      if (addr) {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/toripunks?addr=${addr}`
        );
        return response.json();
      }
    },
    {
      initialData: [],
      refetchInterval: 20000,
      staleTime: Infinity,
      initialDataUpdatedAt: 0,
      refetchOnMount: false,
    }
  );
  if ("err" in data) return getCodeError(data.err);
  return data;
};

export const useBuyTicket = ({
  userTokens,
  buyCount,
  selectedWallet,
}: {
  userTokens: number[];
  buyCount: number;
  selectedWallet?: Wallet;
}) => {
  //   const addr = selectedWallet?.address || "";
  const buyArray =
    buyCount === 1 ? userTokens.shift() : userTokens.splice(0, buyCount);

  const dataBody = { addr, toripunk: buyArray };
  const URL =
    buyCount === 1
      ? `https://api.roulette.aaa-metahuahua.com/ticket/buy`
      : `https://api.roulette.aaa-metahuahua.com/tickets/buy`;

  const { data, mutate, isError, isLoading } = useMutation(
    ["toripunk", userTokens, "buyCount", buyCount, "wallet", selectedWallet],
    async () => {
      if (addr) {
        const res = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataBody),
        });
        return await res.json();
      }
    }
  );
  return { data, mutate, isError, isLoading };
};
