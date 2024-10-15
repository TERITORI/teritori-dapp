import {
  GnoJSONRPCProvider,
  GnoWallet,
  MemFile,
  MemPackage,
  MsgSend,
  decodeTxMessages,
} from "@gnolang/gno-js-client";
import { TransactionEndpoint, Tx, TxFee } from "@gnolang/tm2-js-client";
import Long from "long";
import React from "react";
import { Pressable } from "react-native";
import { create } from "zustand";

import { Wallet } from "../wallet";

import { getUserId } from "@/networks";
import { gnoDevNetwork } from "@/networks/gno-dev";
import { setSelectedWalletId } from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";
import { AdenaDoContractMessage, RequestDocontractMessage } from "@/utils/gno";
import { WalletProvider } from "@/utils/walletProvider";

type UseGnotestResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

interface GnotestState {
  connected: boolean;
  wallet: GnoWallet | null;
  address: string | null;
  accounts: Account[];
  connect: () => void;
}

interface Account {
  wallet: GnoWallet;
  address: string;
}

const network = gnoDevNetwork;

interface UserMetadata {
  imageURI: string;
  displayName: string;
  bio: string;
}

interface TestUser {
  name: string;
  mnemonic: string;
  nsName: string;
  extra: UserMetadata;
}

const faucetMnemo =
  "chimney entire define lesson scale embark copy bird rough govern surprise soda sand evidence decline crisp clinic merry slice balance typical creek lumber hollow";

const testUsers: TestUser[] = [
  // Empty user
  {
    name: "empty",
    nsName: "",
    mnemonic:
      "taste seed tuition love multiply member deposit cause stock access float sport guard air clog horn half equip file cool ghost cupboard kidney inflict",
    extra: {
      imageURI: "",
      displayName: "",
      bio: "",
    },
  },
  {
    name: "alice",
    nsName: "alicetests",
    mnemonic:
      "clog eager dumb mango sibling crime soldier climb switch either lock festival raven please badge weasel misery host grant make half assume strategy buzz",
    extra: {
      imageURI:
        "ipfs://bafybeignxvdw76wqsokthgyp4d3jrvbdiikqwo4vbff6rwb5ivj7fb3aoi",
      displayName: "Alice",
      bio: "Seasoned marketing strategist with a knack for digital campaigns and brand building. With a background in content creation and SEO, has helped numerous startups grow their online presence and engage with their target audience effectively. Outside of work, is an avid reader, enjoys playing guitar, and is a dedicated coffee enthusiast. Reach out for insights on marketing trends and effective brand strategies.",
    },
  },
  {
    name: "bob",
    nsName: "bobtests",
    mnemonic:
      "vault garment mosquito legend merit level flavor width correct amazing window skill title dwarf another journey cube junior chat ivory toilet area pool brick",
    extra: {
      imageURI:
        "ipfs://bafkreifvzfnitqu6yq2t4dp37oeaqvitepuutrox332kcs5jncl7uxo6sy",
      displayName: "Bob",
      bio: "Passionate software developer with over 10 years of experience in web and mobile application development. Specializes in JavaScript, React, and Node.js, and loves creating seamless user experiences. When not coding, enjoys hiking, photography, and volunteering at local animal shelters. Connect to discuss innovative tech solutions and collaborative projects.",
    },
  },
  {
    name: "dredd",
    nsName: "dreddtests",
    mnemonic:
      "nice daughter demise elevator gate manage observe real outer awkward profit sheriff total boat collect voice speed board pilot rifle nephew grid permit frozen",
    extra: {
      imageURI:
        "ipfs://bafkreiahgkmcppkvxhkus7baqnflrcrff2pkjboi4t4eebt3dq6ui66foi",
      displayName: "Dredd",
      bio: "Cybersecurity expert with a focus on network security and ethical hacking. With over 15 years in the field, has a proven track record of safeguarding organizations from cyber threats and vulnerabilities. Also a frequent speaker at industry conferences and enjoys writing articles on the latest in cybersecurity. In free time, practices martial arts and enjoys building custom PCs. Connect for advice on protecting digital assets and staying ahead of cyber threats.",
    },
  },
];

const useGnotestStore = create<GnotestState>((set, get) => ({
  connected: false,
  accounts: [],
  wallet: null,
  address: null,
  connect: async () => {
    const state = get();
    if (state.connected) {
      return;
    }

    const provider = new GnoJSONRPCProvider(network.endpoint);

    const faucetWallet = await GnoWallet.fromMnemonic(faucetMnemo);
    faucetWallet.connect(provider);
    const faucerAddr = await faucetWallet.getAddress();

    // fund users
    const msgs = await Promise.all(
      testUsers.map(async (testUser) => {
        const wallet = await GnoWallet.fromMnemonic(testUser.mnemonic);
        wallet.connect(provider);
        // fund user
        const msg: MsgSend = {
          from_address: faucerAddr,
          to_address: await wallet.getAddress(),
          amount: "200000000000ugnot",
        };
        return msg;
      }),
    );
    const tx: Tx = {
      messages: msgs.map((msg) => ({
        typeUrl: "/bank.MsgSend",
        value: MsgSend.encode(msg).finish(),
      })),
      fee: {
        gasFee: "1ugnot",
        gasWanted: Long.fromNumber(1000000),
      },
      memo: "",
      signatures: [],
    };
    const signed = await faucetWallet.signTransaction(tx, decodeTxMessages);
    await faucetWallet.sendTransaction(
      signed,
      TransactionEndpoint.BROADCAST_TX_COMMIT,
    );

    const accounts = await Promise.all(
      testUsers.map(async (testUser) => {
        const wallet = await GnoWallet.fromMnemonic(testUser.mnemonic);
        wallet.connect(provider);
        const addr = await wallet.getAddress();

        // try register user
        try {
          const nsRealm = network.nameServiceContractAddress;
          const send = new Map<string, number>();
          send.set("ugnot", 200000000);
          await wallet.callMethod(
            nsRealm,
            "Register",
            ["", testUser.nsName, ""],
            TransactionEndpoint.BROADCAST_TX_COMMIT,
            send,
            {
              gasWanted: Long.fromNumber(10000000),
              gasFee: "1ugnot",
            },
          );

          const profileRealm = network.profilePkgPath;
          if (profileRealm) {
            await wallet.callMethod(
              profileRealm,
              "SetStringField",
              ["DisplayName", testUser.extra.displayName],
              TransactionEndpoint.BROADCAST_TX_COMMIT,
              undefined,
              {
                gasWanted: Long.fromNumber(1000000),
                gasFee: "1ugnot",
              },
            );
            await wallet.callMethod(
              profileRealm,
              "SetStringField",
              ["Avatar", testUser.extra.imageURI],
              TransactionEndpoint.BROADCAST_TX_COMMIT,
              undefined,
              {
                gasWanted: Long.fromNumber(1000000),
                gasFee: "1ugnot",
              },
            );
            await wallet.callMethod(
              profileRealm,
              "SetStringField",
              ["Bio", testUser.extra.bio],
              TransactionEndpoint.BROADCAST_TX_COMMIT,
              undefined,
              {
                gasWanted: Long.fromNumber(1000000),
                gasFee: "1ugnot",
              },
            );
          }
        } catch (e) {
          console.warn("Failed to register user", testUser, e);
        }

        return {
          wallet,
          address: addr,
        };
      }),
    );
    set((state) => ({
      ...state,
      connected: true,
      accounts,
      wallet: accounts[0].wallet,
      address: accounts[0].address,
    }));
  },
}));

const setupAdenaMock = () => {
  (window as any).adena = {
    SetTestUser: async (name: string) => {
      const testUser = testUsers.find((u) => u.name === name);
      if (!testUser) {
        throw new Error("Test user not found: " + name);
      }
      const newAddr = await (
        await GnoWallet.fromMnemonic(testUser.mnemonic)
      ).getAddress();
      const state = useGnotestStore.getState();
      const account = state.accounts.find((a) => a.address === newAddr);
      if (!account) {
        throw new Error("Account not found: " + newAddr);
      }
      useGnotestStore.setState({
        wallet: account.wallet,
        address: account.address,
      });
      return getUserId(network.id, account.address);
    },
    GetAccount: async () => {
      const state = useGnotestStore.getState();
      return {
        data: {
          address: state.address,
          chainId: network.chainId,
        },
      };
    },
    DoContract: async (req: RequestDocontractMessage) => {
      try {
        const state = useGnotestStore.getState();
        if (!state.wallet) {
          throw new Error("Wallet not connected");
        }
        const msg = req.messages[0];
        if (msg.type !== "/vm.m_call" && msg.type !== "/vm.m_addpkg") {
          throw new Error("Unsupported message type: " + msg.type);
        }
        const txFee: TxFee = {
          gasWanted: Long.fromNumber(req.gasWanted),
          gasFee: req.gasFee.toString() + "ugnot",
        };
        let sendMap;
        if (msg.value.send) {
          sendMap = new Map<string, number>();
          const end = msg.value.send.length - "ugnot".length;
          const sendAmount = (msg.value.send as string).substring(0, end);
          console.log("docontract sendAmount", sendAmount);
          sendMap.set("ugnot", +sendAmount);
        }
        let res;
        if (msg.type === "/vm.m_call") {
          res = await state.wallet.callMethod(
            msg.value.pkg_path,
            msg.value.func,
            msg.value.args,
            TransactionEndpoint.BROADCAST_TX_COMMIT,
            sendMap,
            txFee,
          );
        } else {
          res = await deployPackage(state.wallet, msg, sendMap, txFee);
        }
        return {
          status: "success",
          data: {
            hash: res.hash,
            height: res.height,
          },
        };
      } catch (e) {
        console.error("docontract error", e);
        const errMsg = e instanceof Error ? e.message : `${e}`;
        return {
          status: "failure",
          message: errMsg,
          data: {
            error: e,
          },
        };
      }
    },
  };
};

const deployPackage = async (
  wallet: GnoWallet,
  msg: AdenaDoContractMessage,
  funds: Map<string, number> | undefined,
  txFee: TxFee,
) => {
  const files: MemFile[] = msg.value.package.files;

  const pkg: MemPackage = {
    name: msg.value.package.name,
    path: msg.value.package.path,
    files,
  };

  const tx = await wallet.deployPackage(
    pkg,
    TransactionEndpoint.BROADCAST_TX_COMMIT,
    funds,
    txFee,
  );
  return tx;
};

export const useGnotest: () => UseGnotestResult = () => {
  const { wallet, address } = useGnotestStore();
  const wallets: Wallet[] = [];
  if (wallet && address) {
    wallets.push({
      address,
      provider: WalletProvider.Gnotest,
      networkKind: network.kind,
      networkId: network.id,
      userId: getUserId(network.id, address),
      connected: true,
      id: `gnotest`,
    });
  }
  return [true, true, wallets];
};

export const ConnectGnotestButton: React.FC<{
  onDone?: () => void;
}> = ({ onDone }) => {
  const { connect } = useGnotestStore();
  const dispatch = useAppDispatch();
  return (
    <TestHiddenButton
      onPress={() => {
        setupAdenaMock();
        connect();
        dispatch(setSelectedWalletId("gnotest"));
        onDone?.();
      }}
      testID="connect-gnotest-wallet"
    />
  );
};

const TestHiddenButton: React.FC<{
  testID: string | undefined;
  onPress: () => void;
}> = ({ testID, onPress }) => {
  return (
    <Pressable style={{ display: "none" }} testID={testID} onPress={onPress} />
  );
};
