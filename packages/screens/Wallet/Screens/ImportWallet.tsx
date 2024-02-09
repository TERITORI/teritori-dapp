import { Secp256k1HdWallet } from "@cosmjs/amino";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { mustGetCosmosNetwork } from "../../../networks";
import { addSelected, selectAllWallets } from "../../../store/slices/wallets";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral15,
  neutral22,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../../Mini/components/Button/CustomButton";
import Checkbox from "../../Mini/components/Checkbox/Checkbox";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";
import { getNativeWallet, setMnemonic } from "../hooks/getNativeWallet";
import { correctMnemonic } from "../util/seed";

export const ImportWallet: ScreenFC<"ImportWallet"> = ({ navigation }) => {
  const [localPhrase, setLocalPhrase] = useState<string | undefined>(undefined);
  const wallets = useSelector(selectAllWallets);
  const networkId = useSelectedNetworkId();
  const network = mustGetCosmosNetwork(networkId);
  const dispatch = useAppDispatch();
  const [wallet, setWallet] = useState<Secp256k1HdWallet>();
  const maxIndex = wallets.reduce(
    (max, wallet) => Math.max(max, wallet.index),
    0,
  );
  const [isChecked, setIsChecked] = useState(false);

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
                setLocalPhrase(correctMnemonic(text));
              }}
              style={[fontSemibold16, { color: secondaryColor, width: "100%" }]}
            />
          </View>
        </View>

        <View>
          <Checkbox
            isChecked={isChecked}
            onPress={() => setIsChecked(true)}
            value="item"
            label="This phrase will only be stored on this device. Teritori can’t recover it for you."
            labelStyle={[{ color: neutralA3, lineHeight: 22, flex: 1 }]}
            type="circle"
            size="md"
            wrapperStyle={{
              alignItems: "center",
              borderRadius: layout.borderRadius,
              backgroundColor: neutral22,
              paddingVertical: layout.spacing_x1,
              paddingHorizontal: layout.spacing_x2,
            }}
          />
          <SpacerColumn size={2} />
          <CustomButton
            onPress={(_, navigation) => {
              console.log(localPhrase);
              if (!localPhrase) {
                return;
              }
              (async () => {
                await setMnemonic(localPhrase, maxIndex + 1);
                const native = await getNativeWallet("TORI", maxIndex + 1);

                if (
                  (native as unknown as string) === "bad mnemonic" ||
                  !native
                ) {
                  alert("Invalid mnemonic");
                  return;
                }
                setWallet(native);
              })();
              if (wallet) {
                wallet.getAccounts().then((accounts) => {
                  dispatch(
                    addSelected({
                      address: accounts[0].address,
                      network: network.kind,
                      provider: "native",
                      networkId: "teritori",
                      index: maxIndex + 1,
                    }),
                  );
                });
                navigation.navigate("CreatePasswordWallet");
              }
            }}
            textStyle={{ textTransform: "uppercase" }}
            title="Next"
            isDisabled={!isChecked}
          />
        </View>
      </View>
    </MultiStepScreenContainer>
  );
};
