import { Secp256k1HdWallet } from "@cosmjs/amino";
import { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import rightArrowSVG from "../../../../assets/icons/arrow-right.svg";
import CustomAppBar from "../../Mini/components/AppBar/CustomAppBar";
import BlurViewWrapper from "../../Mini/components/BlurViewWrapper";
import { CustomButton } from "../../Mini/components/Button/CustomButton";
import Checkbox from "../../Mini/components/Checkbox/Checkbox";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getMnemonic, getNativeWallet } from "@/hooks/wallet/getNativeWallet";
import { mustGetCosmosNetwork } from "@/networks";
import { addSelected, selectAllWallets } from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { dangerColor, neutral22, neutralA3 } from "@/utils/style/colors";
import {
  fontMedium16,
  fontSemibold14,
  fontSemibold15,
  fontSemibold30,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { createMnemonic } from "@/utils/wallet/seed";

export const CreateWalletScreen: ScreenFC<"CreateWallet"> = ({
  navigation,
}) => {
  const { width } = useWindowDimensions();
  const wallets = useSelector(selectAllWallets);
  const networkId = useSelectedNetworkId();
  const network = mustGetCosmosNetwork(networkId);
  const dispatch = useAppDispatch();
  const [wallet, setWallet] = useState<Secp256k1HdWallet>();
  const maxIndex = wallets.reduce(
    (max, wallet) => Math.max(max, wallet.index),
    0,
  );
  const [localPhrase, setLocalPhrase] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const mnemonicValue = await getMnemonic(maxIndex + 1);
      const native = await getNativeWallet("tori", maxIndex + 1);

      setWallet(native);
      setLocalPhrase(mnemonicValue || undefined);
    })();
  }, [maxIndex]);

  useEffect(() => {
    if (localPhrase === undefined) {
      setLocalPhrase(createMnemonic());
    }
  }, [localPhrase, maxIndex]);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ScreenContainer
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={
        <CustomAppBar
          backEnabled
          right={
            <CustomPressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                navigation.navigate("CreatePasswordWallet");
              }}
            >
              <BrandText
                style={[fontSemibold15, { textTransform: "uppercase" }]}
              >
                Skip & Save it later{" "}
              </BrandText>
              <SpacerRow size={0.5} />
              <SVG source={rightArrowSVG} />
            </CustomPressable>
          }
        />
      }
    >
      <View
        style={{
          flex: 1,
          width,
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
          <SpacerColumn size={1} />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <BrandText style={fontSemibold30}>{`Seed Phrase #${
              maxIndex + 1
            }`}</BrandText>

            <SpacerColumn size={1} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              This phrase is the only way to recover the wallet.
            </BrandText>

            <SpacerColumn size={0.5} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              DO NOT share it with anyone
            </BrandText>
          </View>

          <SpacerColumn size={4} />

          <BlurViewWrapper
            hideButton
            copy={localPhrase}
            wrapperStyle={{
              height: 324,
              width: "100%",
              position: "relative",
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 12,
            }}
            blurContainerStyle={{ justifyContent: "flex-end" }}
          >
            {localPhrase?.split(" ").map((seed) => (
              <BrandText
                key={seed}
                style={[fontSemibold14, { textAlign: "center", width: "25%" }]}
              >
                {seed}
              </BrandText>
            ))}
          </BlurViewWrapper>
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
              if (wallet) {
                wallet.getAccounts().then((accounts) => {
                  dispatch(
                    addSelected({
                      address: accounts[0].address,
                      network: network.kind,
                      name: `Account ${maxIndex + 1}`,
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
            isDisabled={!isChecked || !wallet}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
