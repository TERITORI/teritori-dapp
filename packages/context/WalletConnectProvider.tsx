import { AccountData } from "@cosmjs/proto-signing";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";
import { saveMobileLinkInfo } from "@walletconnect/browser-utils";
import WalletConnectV1 from "@walletconnect/client";
import WalletConnectV2 from "@walletconnect/sign-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

import { useFeedbacks } from "./FeedbacksProvider";
import { cosmosNetwork } from "../networks/cosmos-hub";
import { osmosisNetwork } from "../networks/osmosis";
import { getRequiredNamespaces } from "../utils/wallet-connect";

export const projectId = "35af599716d2b9b87a365ef8b12e4008";

interface WalletConnectState {
  client?: WalletConnectV2;
  pairingURI?: string;
  accounts: { account: AccountData; networkId: string }[];
  topic?: string;
  connect: () => Promise<void> | void;
}

const defaultValue: WalletConnectState = { accounts: [], connect: () => {} };

const WalletConnectContext = createContext(defaultValue);

const networks = [cosmosNetwork, osmosisNetwork];

const isMobileBrowser = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || (window as any).opera);
  return check;
};

export const WalletConnectProvider: React.FC = ({ children }) => {
  const [stateClient, setClient] = useState(defaultValue.client);
  const [pairingURI, setPairingURL] = useState(defaultValue.pairingURI);
  const [sessionTopic, setSessionTopic] = useState<string>();
  const [accounts, setAccounts] = useState(defaultValue.accounts);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const createWalletConnectV1 = (): WalletConnectV1 => {
    const wc = new WalletConnectV1({
      bridge: "https://bridge.walletconnect.org", // Required
      signingMethods: [
        "keplr_enable_wallet_connect_v1",
        "keplr_sign_amino_wallet_connect_v1",
      ],
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          if (!isMobileBrowser) {
            setPairingURL(uri);
            return;
          }

          // use deep link on mobile
          const base = "keplrwallet://wcV1";
          saveMobileLinkInfo({
            name: "Keplr",
            href: base,
          });
          const finalURI = `${base}?${uri}`;
          console.log("uri", finalURI);
          window.location.href = finalURI;
          //cb();
        },
        close: () => {
          setPairingURL(undefined);
        },
      },
      /*clientMeta: {
        name: "Teritori App",
        description: "",
        url: "https://app.teritori.com",
        icons: [],
      },*/
    });

    // XXX: I don't know why they designed that the client meta options in the constructor should be always ingored...
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

    //const useV1 = Platform.OS === "web" && isMobileBrowser();
    const useV1 = true;

    if (useV1) {
      const connector = await new Promise<WalletConnectV1>(
        async (resolve, reject) => {
          const connector = createWalletConnectV1();

          // Check if connection is already established
          if (connector.connected) {
            // await connector.killSession();
            console.log("connected to existing wc session");
            resolve(connector);
            return;
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

      try {
        const keplr = new KeplrWalletConnectV1(connector, {
          // sendTx: sendTxWC,
        });
        console.log("new session", keplr);

        await keplr.enable(networks.map((n) => n.chainId));

        console.log("enabled chains");

        let accounts: { account: AccountData; networkId: string }[] = [];

        for (const n of networks) {
          accounts = [
            ...accounts,
            ...(await keplr.getOfflineSigner(n.chainId).getAccounts()).map(
              (a) => ({ account: a, networkId: n.id })
            ),
          ];
        }

        console.log("got accounts", accounts);

        setAccounts(accounts);
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
      return;
    }

    // V2
    let client = stateClient;
    if (!client) {
      console.log("initializing wallet connect client");
      const newClient = await WalletConnectV2.init({
        // logger: "debug",
        projectId,
        metadata: {
          name: "Teritori App",
          description: "",
          url: "",
          icons: [],
        },
      });
      console.log("wallet connect client initialized");

      const namespaces = getRequiredNamespaces(
        networks.map((n) => "cosmos:" + n.chainId)
      );
      const sessions = newClient.find({ requiredNamespaces: namespaces });
      if (sessions.length) {
        setSessionTopic(sessions[0].topic);
        console.log("connected to existing session", sessions[0].topic);
      }

      console.log("sessions", sessions);

      setClient(newClient);
      client = newClient;
    }

    const namespaces = getRequiredNamespaces(
      networks.map((n) => "cosmos:" + n.chainId)
    );

    const { uri, approval } = await client.connect({
      // pairingTopic: pairing?.topic,
      requiredNamespaces: namespaces,
    });

    console.log("got peering uri", uri);

    setPairingURL(uri);

    console.log("Waiting for session");
    const session = await approval();
    console.log("Established session:", session);

    setSessionTopic(session.topic);
  }, [setToastError, setToastSuccess, stateClient]);

  useEffect(() => {
    const effect = async () => {
      if (!stateClient || !sessionTopic) return;
      console.log("refreshing wc accounts");
      const accountsLists = await Promise.all(
        networks.map(async (n) => {
          const accounts: AccountData[] = await stateClient.request({
            topic: sessionTopic,
            chainId: "cosmos:" + n.chainId,
            request: {
              method: "cosmos_getAccounts",
              params: {},
            },
          });
          return { accounts, networkId: n.id };
        })
      );
      const accounts = accountsLists.reduce(
        (all, list) => [
          ...all,
          ...list.accounts.map((a) => ({
            account: a,
            networkId: list.networkId,
          })),
        ],
        [] as { account: AccountData; networkId: string }[]
      );

      console.log("Got WalletConnect accounts", accounts);

      setAccounts(accounts);
    };
    effect();
  }, [stateClient, sessionTopic]);

  const state = useMemo(() => {
    return {
      client: stateClient,
      pairingURI,
      accounts,
      connect,
      topic: sessionTopic,
    };
  }, [accounts, stateClient, connect, pairingURI, sessionTopic]);

  return (
    <WalletConnectContext.Provider value={state}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export const useWalletConnect = () => useContext(WalletConnectContext);
