import React from "react";
import { View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import penSVG from "../../../assets/icons/manage.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useBalances } from "../../hooks/useBalances";
import { rewardsPrice, useRewards } from "../../hooks/useRewards";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../utils/navigation";
import { getShortAddress_Big } from "../../utils/strings";
import { neutral17, neutral22, neutralA3 } from "../../utils/style/colors";
import { layout, smallMobileWidth } from "../../utils/style/layout";

interface WalletDashboardHeaderProps {
  title: string;
  data: string;
  actionButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
}

const WalletDashboardHeaderCard: React.FC<WalletDashboardHeaderProps> = ({
  title,
  data,
  actionButton,
}) => {
  const { width } = useWindowDimensions();

  return (
    <TertiaryBox
      height={width < smallMobileWidth ? 150 : 116}
      width={width < smallMobileWidth ? 120 : 200}
      mainContainerStyle={{
        backgroundColor: neutral17,
      }}
      style={{
        marginLeft: width < smallMobileWidth ? 0 : 16,
      }}
    >
      <View
        style={{
          paddingVertical: width < smallMobileWidth ? 5 : 14,
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
        {width < smallMobileWidth && !!actionButton && (
          <PrimaryButton
            disabled={actionButton.disabled}
            size="XS"
            text={actionButton.label}
            onPress={actionButton.onPress}
            squaresBackgroundColor={neutral17}
            touchableStyle={{
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        )}
        <BrandText
          style={{
            fontSize: 16,
          }}
        >
          {data}
        </BrandText>
        {width > smallMobileWidth && !!actionButton && (
          <PrimaryButton
            disabled={actionButton.disabled}
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
  const selectedNetworkId = useSelectedNetworkId();
  const tnsMetadata = useTNSMetadata(selectedWallet?.address);
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const navigation = useAppNavigation();
  const totalUSDBalance = balances.reduce(
    (total, bal) => total + (bal.usdAmount || 0),
    0
  );
  const { totalsRewards, claimAllRewards } = useRewards(
    selectedWallet?.address
  );
  // Total rewards price with all denoms
  const claimablePrice = rewardsPrice(totalsRewards);

  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: layout.contentPadding,
        paddingBottom: 16,
        flex: 1,
        flexWrap: "wrap",
        marginTop: -layout.padding_x3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: layout.padding_x3,
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
          onPress={() => navigation.navigate("TNSHome", { modal: "manage" })}
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
            {getShortAddress_Big(
              tnsMetadata.metadata?.tokenId || selectedWallet?.address || "",
              width
            )}
          </BrandText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: width < smallMobileWidth ? "100%" : "",
          marginTop: layout.padding_x3,
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
            data: `$${claimablePrice.toFixed(2)}`,
            actionButton: {
              label: "Claim All",
              onPress: claimAllRewards,
              disabled: !claimablePrice,
            },
          }}
        />
      </View>
    </View>
  );
};
