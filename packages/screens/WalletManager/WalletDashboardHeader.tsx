import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import penSVG from "../../../assets/icons/manage.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral17, neutral22, neutralA3 } from "../../utils/style/colors";

interface WalletDashboardHeaderProps {
  title: string;
  data: string;
  actionButton?: {
    label: string;
    onPress: () => void;
  };
}

const WalletDashboardHeaderCard: React.FC<WalletDashboardHeaderProps> = ({
  title,
  data,
  actionButton,
}) => {
  return (
    <TertiaryBox
      height={116}
      width={200}
      mainContainerStyle={{
        backgroundColor: neutral17,
      }}
      style={{
        marginLeft: 16,
      }}
    >
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 12,
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: 116,
          position: "relative",
        }}
      >
        <BrandText
          style={{
            fontSize: 12,
          }}
        >
          {title}
        </BrandText>
        <BrandText
          style={{
            fontSize: 16,
          }}
        >
          {data}
        </BrandText>
        {!!actionButton && (
          <PrimaryButton
            size="XS"
            text={actionButton.label}
            onPress={actionButton.onPress}
            squaresBackgroundColor={neutral17}
            touchableStyle={{
              position: "absolute",
              bottom: 12,
              right: 14,
            }}
          />
        )}
      </View>
    </TertiaryBox>
  );
};

export const WalletDashboardHeader: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkId();
  const balances = useBalances(selectedNetwork, selectedWallet?.publicKey);
  const totalUSDBalance = balances.reduce(
    (total, bal) => total + (bal.usdAmount || 0),
    0
  );
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: neutral22,
            height: 40,
            width: 40,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <SVG width={24} height={24} source={penSVG} />
        </TouchableOpacity>
        <View>
          <BrandText
            style={{
              color: neutralA3,
              fontSize: 14,
            }}
          >
            Hello
          </BrandText>
          <BrandText
            style={{
              fontSize: 20,
            }}
          >
            Loream ipsum
          </BrandText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <WalletDashboardHeaderCard
          {...{
            title: "Total Balance",
            data: `$${totalUSDBalance.toFixed(2)}`,
          }}
        />
        <WalletDashboardHeaderCard
          {...{
            title: "Total Claimable Rewards",
            data: "$2.00",
            actionButton: {
              label: "Claim All",
              onPress: () => {},
            },
          }}
        />
      </View>
    </View>
  );
};
