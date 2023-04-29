import { BroadcastMode, StdTx } from "@cosmjs/launchpad";
import { AccountData } from "@cosmjs/proto-signing";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";
import { saveMobileLinkInfo } from "@walletconnect/browser-utils";
import WalletConnectV1 from "@walletconnect/client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useFeedbacks } from "./FeedbacksProvider";
import { CosmosNetworkInfo, NetworkKind, allNetworks } from "../networks";
import { cosmosNetwork } from "../networks/cosmos-hub";
import { osmosisNetwork } from "../networks/osmosis";
import { isMobileBrowser } from "../utils/browser";

// NOTE:
//   - we only target keplr for now
//   - we use WalletConnectV1 for now because keplr deep linking only supports V1

interface WalletConnectState {
  pairingURI?: string;
  keplr?: KeplrWalletConnectV1;
  accounts: { account: AccountData; networkId: string }[];
  connect: () => Promise<void> | void;
}

const defaultValue: WalletConnectState = { accounts: [], connect: () => {} };

const WalletConnectContext = createContext(defaultValue);

const walletConnectNetworks = [cosmosNetwork, osmosisNetwork];

export const WalletConnectProvider: React.FC = ({ children }) => {
  const [pairingURI, setPairingURL] = useState(defaultValue.pairingURI);
  const [accounts, setAccounts] = useState(defaultValue.accounts);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [keplr, setKeplr] = useState<KeplrWalletConnectV1>();

  const createWalletConnectV1 = (): WalletConnectV1 => {
    const wc = new WalletConnectV1({
      bridge: "https://bridge.walletconnect.org", // Required
      signingMethods: [
        "keplr_enable_wallet_connect_v1",
        "keplr_sign_amino_wallet_connect_v1",
      ],
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          if (!isMobileBrowser()) {
            setPairingURL(uri);
            return;
          }

          // use deep link in mobile browsers
          const base = "keplrwallet://wcV1";
          saveMobileLinkInfo({
            name: "Keplr",
            href: base,
          });
          const finalURI = `${base}?${uri}`;
          console.log("uri", finalURI);
          window.location.href = finalURI;
        },
        close: () => {
          setPairingURL(undefined);
        },
      },
    });

    // clientMeta is ignored in constructor
    // @ts-expect-error
    wc._clientMeta = {
      name: "Teritori App",
      description: "Teritori App",
      url: "https://app.teritori.com",
      icons: [
        "https://imgproxy.tools.teritori.com/insecure/width:256/height:256/plain/ipfs%3A%2F%2Fbafkreieqcwmjcb64r42ygs6a4dswz63djzgayjn3rhzjber3e42cknawlm",
      ],
    };

    return wc;
  };

  const connect = useCallback(async () => {
    console.log("connecting to wallet connect");
    try {
      const connector = await new Promise<WalletConnectV1>(
        async (resolve, reject) => {
          const connector = createWalletConnectV1();

          // Check if connection is already established
          if (connector.connected) {
            await connector.killSession();
            /*
            console.log("connected to existing wc session");
            resolve(connector);
            return;
            */
          }

          // create new session
          console.log("creating new wc session");
          await connector.createSession();
          connector.on("connect", async (error) => {
            console.log("received connect event");
            if (error) {
              reject(error);
            }
            resolve(connector);
          });
          setPairingURL(connector.uri);
        }
      );

      const keplr = new KeplrWalletConnectV1(connector, {
        sendTx: sendTxWC,
      });
      console.log("new session", keplr);

      await keplr.enable(walletConnectNetworks.map((n) => n.chainId));

      console.log("enabled chains");

      let accounts: { account: AccountData; networkId: string }[] = [];

      for (const n of walletConnectNetworks) {
        accounts = [
          ...accounts,
          ...(await keplr.getOfflineSigner(n.chainId).getAccounts()).map(
            (a) => ({ account: a, networkId: n.id })
          ),
        ];
      }

      console.log("got accounts", accounts);

      setAccounts(accounts);

      setKeplr(keplr);

      setToastSuccess({ title: "Accounts set", message: "" });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect to wallet",
          message: err.message,
        });
      }
    }
  }, [setToastError, setToastSuccess]);

  const state = useMemo(() => {
    return {
      pairingURI,
      accounts,
      connect,
      keplr,
    };
  }, [accounts, connect, keplr, pairingURI]);

  return (
    <WalletConnectContext.Provider value={state}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export const useWalletConnect = () => useContext(WalletConnectContext);

async function sendTxWC(
  chainId: string,
  tx: StdTx | Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> {
  const restInstance = axios.create({
    baseURL: allNetworks.find(
      (n): n is CosmosNetworkInfo =>
        n.kind === NetworkKind.Cosmos && n.chainId === chainId
    )!.restEndpoint,
  });

  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;

  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString("base64"),
        mode: (() => {
          switch (mode) {
            case "async":
              return "BROADCAST_MODE_ASYNC";
            case "block":
              return "BROADCAST_MODE_BLOCK";
            case "sync":
              return "BROADCAST_MODE_SYNC";
            default:
              return "BROADCAST_MODE_UNSPECIFIED";
          }
        })(),
      }
    : {
        tx,
        mode,
      };

  const result = await restInstance.post(
    isProtoTx ? "/cosmos/tx/v1beta1/txs" : "/txs",
    params
  );

  const txResponse = isProtoTx ? result.data["tx_response"] : result.data;

  if (txResponse.code != null && txResponse.code !== 0) {
    throw new Error(txResponse["raw_log"]);
  }

  return Buffer.from(txResponse.txhash, "hex");
}
