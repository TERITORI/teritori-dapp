import { Decimal } from "@cosmjs/math";
import { useState } from "react";
import { View } from "react-native";

import questionSVG from "../../../../assets/icons/question-gray.svg";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniAddressSelectorDropdown from "../components/MiniAddressSelectorDropdown";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { useGetAssets } from "@/hooks/wallet/useGetAssets";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC } from "@/utils/navigation";
import { neutral39, neutral77 } from "@/utils/style/colors";
import { fontMedium13, fontMedium15, fontMedium16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { getExponentByDenom } from "@/utils/wallet/chain-registry";

const SendToriScreen: ScreenFC<"MiniSendTori"> = ({ navigation, route }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const goBackTo = () =>
    navigation.replace("MiniSelectToken", { navigateTo: "MiniSendingTori" });

  const selectedWallet = useSelectedNativeWallet();

  const assets = useGetAssets(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );
  const { denom } = route.params;
  const selectedToken = assets.find((asset) => asset.denom === denom);
  const {
    metadata: { image, tokenId },
  } = useNSUserInfo(`tori-${address}`);

  if (!selectedToken) {
    return null;
  }
  const amountInAtomics = Decimal.fromUserInput(
    amount,
    getExponentByDenom(selectedToken.denom),
  ).atomics;

  return (
    <BlurScreenContainer
      title={`Send ${selectedToken.symbol}`}
      onGoBack={goBackTo}
    >
      <SpacerColumn size={2} />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <UserAvatarWithFrame userId={`tori-${address}`} size="XL" />
            <BrandText style={[fontMedium15, { color: neutral77 }]}>
              {tokenId}
            </BrandText>
          </View>
        ) : (
          <CircularImgOrIcon
            style={{ alignItems: "center", justifyContent: "center" }}
            icon={selectedToken?.logo_URIs?.png || questionSVG}
          />
        )}
      </View>
      <SpacerColumn size={2} />
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <View>
          <SpacerColumn size={3} />

          <MiniAddressSelectorDropdown
            value={address}
            onChangeText={setAddress}
          />

          <SpacerColumn size={1} />

          <MiniTextInput
            placeholder="Amount"
            keyboardType="numeric"
            type="number"
            value={amount}
            onChangeText={setAmount}
            right={
              <CustomPressable
                onPress={() =>
                  setAmount(selectedToken?.amount.toString() || "")
                }
              >
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <BrandText style={[fontMedium15, { color: neutral77 }]}>
                    {selectedToken?.symbol || "Unknown"}
                  </BrandText>
                  <SpacerRow size={1.5} />
                  <View
                    style={{
                      backgroundColor: neutral39,
                      borderRadius: 18,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}
                  >
                    <BrandText style={fontMedium16}>Max</BrandText>
                  </View>
                </View>
              </CustomPressable>
            }
          />

          <SpacerColumn size={1.5} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            {`Balance ${prettyPrice(
              selectedToken.networkId,
              selectedToken.amount,
              selectedToken.denom,
            )}`}
          </BrandText>
        </View>

        <CustomButton
          title="Next"
          isDisabled={!address || !amount}
          onPress={() =>
            navigation.replace("MiniSendingTori", {
              back: "MiniSendTori",
              amount: amountInAtomics,
              denom,
              address,
            })
          }
        />
      </View>
    </BlurScreenContainer>
  );
};

export default SendToriScreen;
