import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
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
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";
import { setMnemonic } from "../hooks/getNativeWallet";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";
import { correctMnemonic, Seed } from "../util/seed";

export const ImportWallet: ScreenFC<"ImportWallet"> = () => {
  const [seed, setSeed] = useState<Seed>();
  const derivation = "m/44'/118'/0'/0/0";

  return (
    <MultiStepScreenContainer screenPercentage={25} enableBack>
      <SpacerColumn size={8} />
      <View style={{ flex: 1, paddingHorizontal: layout.spacing_x2 }}>
        <View style={{ flex: 1 }}>
          <BrandText style={[fontSemibold28]}>
            Import with Seed Phrase
          </BrandText>
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

          <SpacerColumn size={5} />
          <View
            style={{
              backgroundColor: neutral15,
              borderRadius: 8,
              width: "100%",
              height: 160,

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
      </View>
    </MultiStepScreenContainer>
  );
};
