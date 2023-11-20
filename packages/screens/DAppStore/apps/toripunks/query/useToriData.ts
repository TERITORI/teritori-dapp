import { useMutation, useQuery } from "@tanstack/react-query";

// import { getCodeError } from "./codeError";
import { Wallet } from "../../../../../context/WalletsProvider/wallet";
import {
  getKeplrSigningCosmWasmClient,
  getNetworkByIdPrefix,
} from "../../../../../networks";
import { getCodeError } from "../query/codeError";

export const useList = ({ selectedWallet }: { selectedWallet?: Wallet }) => {
  const addr = selectedWallet?.address || "";
  const { data, refetch } = useQuery(
    ["toripunks", addr],
    async () => {
      try {
        if (addr) {
          const response = await fetch(
            `https://api.roulette.aaa-metahuahua.com/toripunks?addr=${addr}`,
          );
          return (await response.json()) as unknown;
        }
        return [];
      } catch (e) {
        return e;
      }
    },
    {
      initialData: [],
      refetchOnMount: false,
      enabled: false,
    },
  );
  let result = [];
  let error = null;
  if (Array.isArray(data)) {
    result = data;
  } else if (
    typeof data === "object" &&
    !!data &&
    "err" in data &&
    typeof data.err === "string"
  ) {
    error = getCodeError(data.err);
  }
  return { data: result, refetch, error };
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
  const addr = selectedWallet?.address || "";
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
    },
  );
  return { data, mutate, isError, isLoading };
};

export const useProof = ({
  tx,
  selectedWallet,
}: {
  tx: string;
  selectedWallet?: Wallet;
}) => {
  const URL = `https://api.roulette.aaa-metahuahua.com/tickets/proofs`;
  const addr = selectedWallet?.address || "";

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
    },
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
  const network = getNetworkByIdPrefix("tori");
  if (network) {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      network?.id,
    );
    if (selectedWallet) {
      const tx = signingComswasmClient
        .sendTokens(
          selectedWallet?.address,
          "tori148mh99jr2zl4wtdlqrr9gsv3v7ltg4hx8ekzl7",
          [
            {
              denom: "utori",
              amount,
            },
          ],
          "auto",
        )
        .catch(() => {
          return undefined;
        });
      return tx;
    }
  }
};

export const useLastReward = () => {
  const { data, refetch } = useQuery(
    ["lastRewards"],
    async () => {
      try {
        const response = await fetch(
          `https://api.roulette.aaa-metahuahua.com/tickets/last/rewards`,
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
