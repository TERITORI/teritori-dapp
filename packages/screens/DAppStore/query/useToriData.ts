import { useMutation, useQuery } from "@tanstack/react-query";

import { Wallet } from "../../../context/WalletsProvider/wallet";
import {
  getKeplrSigningCosmWasmClient,
  getNetworkByIdPrefix,
} from "../../../networks";
import { getCodeError } from "./codeError";

const addr = "tori1xdtdctdedst45u8c8fmxutg8vvltyg5ezpdycz";

export const useList = ({ selectedWallet }: { selectedWallet?: Wallet }) => {
  //   const addr = selectedWallet?.address || "";
  const { data, refetch } = useQuery(
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
      refetchOnMount: false,
      enabled: false,
    }
  );
  if ("err" in data) return { data: getCodeError(data.err) };
  const dataCopy = [...data];
  return { data: dataCopy, refetch };
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
  const buyArray = Array.isArray(userTokens)
    ? buyCount === 1
      ? userTokens.shift()
      : userTokens.splice(0, buyCount)
    : 0;

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

export const useProof = ({ tx }: { tx: string }) => {
  const URL = `https://api.roulette.aaa-metahuahua.com/tickets/proofs`;

  const { data, mutate, isError, isLoading } = useMutation(
    ["transaction", tx],
    async ({ tickets }: { tickets: string[] }) => {
      if (addr) {
        const dataBody = { tx_hash: tx, tickets };
        const res = await fetch(URL, {
          method: "PUT",
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

export const sendKeplarTx = async ({
  selectedWallet,
  amount,
}: {
  selectedWallet?: Wallet;
  amount: string;
}) => {
  const network = getNetworkByIdPrefix("testori");
  if (network) {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      network?.id
    );
    if (selectedWallet) {
      const tx = signingComswasmClient
        .sendTokens(
          selectedWallet?.address,
          "tori1stvrc5fjw7t60sgkctpjh27j6vgdzdhm5l2gt0",
          [
            {
              denom: "utori",
              amount,
            },
          ],
          "auto"
        )
        .catch(() => {
          return undefined;
        });
      return tx;
    }
  }
};
