/* eslint-disable */
import { Slip10, Slip10Curve, stringToPath } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as bip39 from "bip39";
import { useState } from "react";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { getValueFor, save } from "../../../hooks/useMobileSecureStore";
import { ScreenFC } from "../../../utils/navigation";
import { importLedgerAccount } from "../libs/ledger";

export function createMnemonic(numberOfWords: 12 | 24 = 24): string {
  if (numberOfWords === 12) return bip39.generateMnemonic(128);
  return bip39.generateMnemonic(256);
}

interface Seed {
  derivation: string;
  mnemonic: string;
}

export async function generatePrivateKeyFromHdPath(
  mnemonic: string,
  hdPath: string,
): Promise<string> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const res = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    stringToPath(hdPath),
  );
  return toHex(res.privkey);
}

const getMyAccount = async (seed: Seed) => {
  const myWallet = await DirectSecp256k1HdWallet.fromMnemonic(seed.mnemonic, {
    prefix: "tori",
    // hdPaths: stringToPath(seed.derivation),
  });

  const [mySigner] = await myWallet.getAccounts();
  const myAddress = mySigner.address;
  return { myAddress, myWallet, mySigner };
};

const getLedgerAccountDetails = async () => {
  const { primaryChainAccount, chainWiseAddresses } = await importLedgerAccount(
    Array.from({ length: 4 }, (value, index) => index),
    "teritori",
  );
  console.log(primaryChainAccount, chainWiseAddresses);

  // setWalletAccounts(
  //   primaryChainAccount.map((account, index) => ({
  //     address: account.address,
  //     pubkey: account.pubkey,
  //     index,
  //   })),
  // );
  // const addresses: Addresses = {};
  //
  // for (const [chain, chainAddresses] of Object.entries(chainWiseAddresses)) {
  //   let index = 0;
  //   for (const address of chainAddresses) {
  //     if (addresses[index]) {
  //       addresses[index][chain] = address;
  //     } else {
  //       addresses[index] = { [chain]: address };
  //     }
  //     index += 1;
  //   }
  // }
  //
  // setAddresses(addresses);
};

export const ViewSeed: ScreenFC<"ViewSeed"> = () => {
  const { wrapWithFeedback } = useFeedbacks();

  const [seed, setSeed] = useState<Seed>();
  const [myAddress, setMyAddress] = useState<string>();
  const [myWallet, setMyWallet] = useState<DirectSecp256k1HdWallet>();
  const [mySigner, setMySigner] = useState<any>();

  const createWallet = async () => {
    const fromStorage = await getValueFor("wallet");
    let mnemonic = "";
    if (fromStorage) {
      mnemonic = fromStorage;
    } else {
      mnemonic = createMnemonic();
    }
    const derivation = "m/44'/118'/0'/0/0";
    const seed = { mnemonic, derivation };
    generatePrivateKeyFromHdPath(mnemonic, derivation).then((res) => {
      console.log(res);
    });
    const { myAddress, myWallet, mySigner } = await getMyAccount(seed);
    console.log(myAddress, myWallet, mySigner);
  };

  const saveWallet = async () => {
    await save("wallet", (myWallet?.mnemonic || "").toString());
  };

  return null;
};
