import { useState } from "react";
import { View } from "react-native";

import questionSVG from "../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { prettyPrice } from "../../../utils/coins";
import { ScreenFC } from "../../../utils/navigation";
import { neutral39, neutral77 } from "../../../utils/style/colors";
import {
  fontMedium13,
  fontMedium15,
  fontMedium16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { useSelectedNativeWallet } from "../../Wallet/hooks/useSelectedNativeWallet";
import { useGetAssets } from "../../Wallet/util/chain-registry";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniTextInput from "../components/MiniTextInput";
import MiniTextInputWithDropdown from "../components/MiniTextInputWithDropdown";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

const tokenOptions = [
  {
    label: "Defi",
    subLabel: "f1du...2d6a",
    value: "f1duasdjfanjansjbasd2d6a",
  },
  {
    label: "Defi1",
    subLabel: "f1du...2d6aasdf",
    value: "f1dunasdhjfashdf2d6aasdf",
  },
];

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
  if (!selectedToken) {
    return null;
  }

  return (
    <BlurScreenContainer title="Send TORI" onGoBack={goBackTo}>
      <SpacerColumn size={2} />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularImgOrIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={selectedToken?.logo_URIs?.svg || questionSVG}
        />
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

          <MiniTextInputWithDropdown
            options={tokenOptions}
            value={address}
            onChangeText={(value) => setAddress(value)}
          />

          <SpacerColumn size={1} />

          <MiniTextInput
            placeholder="Amount"
            keyboardType="numeric"
            type="number"
            value={amount}
            onChangeText={(value) => setAmount(value)}
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
          onPress={() =>
            navigation.replace("MiniSendingTori", {
              back: "MiniSendTori",
              amount,
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
