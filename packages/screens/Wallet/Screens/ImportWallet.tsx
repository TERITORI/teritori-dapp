/* eslint-disable */
import { Slip10, Slip10Curve, stringToPath } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as bip39 from "bip39";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral15,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";
import { TopBarWithProgress } from "../layout/TopBarWithProgress";
import { WalletContainer } from "../layout/WalletContainer";
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
};

export const ImportWallet: ScreenFC<"ImportWallet"> = () => {
  const [seed, setSeed] = useState<Seed>();
  const derivation = "m/44'/118'/0'/0/0";

  return (
    <WalletContainer>
      <TopBarWithProgress progress={30} />
      <View
        style={{
          width: "100%",
          flex: 7,
          marginTop: layout.spacing_x3,
          alignItems: "flex-start",
        }}
      >
        <BrandText style={[fontSemibold28]}>Import with Seed Phrase</BrandText>
        <BrandText
          style={[
            fontSemibold16,
            { color: neutral77, marginTop: layout.spacing_x1 },
          ]}
        >
          Import an existing wallet with a 12 or 24-word seed phrase.
        </BrandText>
        <View
          style={{
            backgroundColor: neutral15,
            borderRadius: 8,
            width: "100%",
            height: 160,
            marginTop: layout.spacing_x4,
            padding: layout.spacing_x1,
            alignItems: "center",
            borderWidth: 1,
            borderColor: neutralA3,
          }}
        >
          <TextInput
            editable
            multiline
            numberOfLines={4}
            onChangeText={(text) => {
              setSeed({ mnemonic: text, derivation });
            }}
            value={seed?.mnemonic}
            style={[fontSemibold16, { color: secondaryColor, width: "100%" }]}
          />
        </View>
      </View>
      <AcceptAndNavigate
        buttonText="Next"
        text="This phrase will only be stored on this device. Teritori can’t recover it for you."
        navigateTo="CreatePassword"
      />
    </WalletContainer>
  );
};
