import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral15,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold16,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { setMnemonic } from "../hooks/getNativeWallet";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";
import { TopBarWithProgress } from "../layout/TopBarWithProgress";
import { WalletContainer } from "../layout/WalletContainer";
import { correctMnemonic, Seed } from "../util/seed";

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
            {
              color: neutral77,
              marginTop: layout.spacing_x1,
            },
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
              setSeed({ mnemonic: correctMnemonic(text), derivation });
            }}
            value={seed?.mnemonic}
            style={[fontSemibold16, { color: secondaryColor, width: "100%" }]}
          />
        </View>
      </View>

      <AcceptAndNavigate
        buttonText="Next"
        value="ok"
        label={
          <Pressable
            onPress={() => {
              if (seed) {
                setMnemonic(seed.mnemonic);
              }
            }}
          >
            <BrandText
              style={[fontMedium16, { color: neutralA3, lineHeight: 22 }]}
            >
              "This phrase will only be stored on this device. Teritori can’t
              recover it for you."
            </BrandText>
          </Pressable>
        }
        navigateTo="CreatePassword"
      />
    </WalletContainer>
  );
};
