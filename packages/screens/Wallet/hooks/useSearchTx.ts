import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TxResponseSDKType } from "osmojs/dist/codegen/cosmos/base/abci/v1beta1/abci";

import { getNetwork, NetworkInfo, NetworkKind } from "../../../networks";

export const useSearchTx = (
  networkId: string | undefined,
  address: string | undefined,
) => {
  const {
    data: transactions,
    error,
    isLoading,
  } = useQuery(
    ["transactions", networkId, address],
    async () => {
      const network = getNetwork(networkId);
      if (!network || !address) {
        return [];
      }
      return await getLastFiveTransactions(network, address);
    },
    {
      staleTime: 1000 * 60, // data is considered fresh for 1 minute
      retry: 3,
    },
  );

  return {
    transactions,
    error,
    isLoading,
  };
};

export const getLastFiveTransactions = async (
  network: NetworkInfo,
  address: string,
) => {
  switch (network.kind) {
    case NetworkKind.Ethereum: {
      throw new Error("Not implemented");
    }

    case NetworkKind.Gno: {
      throw new Error("Not implemented");
    }

    case NetworkKind.Cosmos: {
      const nodeUrl = network.restEndpoint;
      // DOCS:
      // https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/tx/v1beta1/service.proto#L83
      const sender = [
        `transfer.sender='${address}'`,
        "message.action='/cosmos.bank.v1beta1.MsgSend'",
      ];

      const responseSender = await axios.get(
        `${nodeUrl}/cosmos/tx/v1beta1/txs?events=${sender.join(
          "&",
        )}&limit=5&order_by=2`,
      );

      const recipient = [
        `transfer.recipient='${address}'`,
        "message.action='/cosmos.bank.v1beta1.MsgSend'",
      ];

      const responseRecipient = await axios.get(
        `${nodeUrl}/cosmos/tx/v1beta1/txs?events=${recipient.join(
          "&",
        )}&limit=5&order_by=2`,
      );

      // merge and sort
      const blocks = responseSender.data.tx_responses.concat(
        responseRecipient.data.tx_responses,
      );

      blocks.sort((a: TxResponseSDKType, b: TxResponseSDKType) => {
        return Number(b.height) - Number(a.height);
      });

      return blocks.map((txResponse: TxResponseSDKType) => {
        // const events = blocks.logs[0].events
        //   .filter((message) => {
        //     return message.type === "transfer";
        //   })
        //   .map((message) => {
        //     const amount = message.attributes.find((attr) => attr.key === "amount");
        //     const recipient = message.attributes.find(
        //       (attr) => attr.key === "recipient",
        //     );
        //     const sender = message.attributes.find((attr) => attr.key === "sender");
        //     if (
        //       sender === undefined ||
        //       recipient === undefined ||
        //       amount === undefined
        //     ) {
        //       return {
        //         amount: "",
        //         recipient: "",
        //         sender: "",
        //       };
        //     }
        //
        //     return {
        //       amount: amount.value,
        //       recipient: recipient.value,
        //       sender: sender.value,
        //     };
        //   });

        return {
          // @ts-expect-error
          txhash: txResponse.txhash ? txResponse.txhash : txResponse.hash,
          height: txResponse.height,
          // events,
          // @ts-expect-error
          tx: txResponse.tx.body.messages[0], // support only one message ?
        };
      });
    }
  }
};
