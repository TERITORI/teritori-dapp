import React, { useMemo } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import penSVG from "../../../assets/icons/manage.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { LegacyTertiaryBox } from "../../components/boxes/LegacyTertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useBalances } from "../../hooks/useBalances";
import { useDelegations } from "../../hooks/useDelegations";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { rewardsPrice, useRewards } from "../../hooks/useRewards";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { UserKind } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17, neutral22, neutralA3 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";

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
  return (
    <LegacyTertiaryBox
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
            disabled={actionButton.disabled}
            size="XS"
            text={actionButton.label}
            onPress={actionButton.onPress}
            touchableStyle={{
              position: "absolute",
              bottom: 12,
              right: 14,
            }}
          />
        )}
      </View>
    </LegacyTertiaryBox>
  );
};

export const WalletDashboardHeader: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = selectedWallet?.networkId;
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const navigation = useAppNavigation();
  const { delegationsBalances } = useDelegations(
    selectedNetworkId,
    selectedWallet?.address,
  );
  const availableUSDBalance = useMemo(
    () => balances.reduce((total, bal) => total + (bal.usdAmount || 0), 0),
    [balances],
  );
  const delegationsUsdBalance = useMemo(
    () =>
      delegationsBalances.reduce(
        (total, bal) => total + (bal.usdAmount || 0),
        0,
      ),
    [delegationsBalances],
  );
  const { totalsRewards, claimAllRewards } = useRewards(
    selectedWallet?.userId,
    UserKind.Single,
  );
  // Total rewards price with all denoms
  const claimablePrice = rewardsPrice(totalsRewards);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: layout.contentSpacing,
        flex: 1,
        flexWrap: "wrap",
        marginTop: -layout.spacing_x3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: layout.spacing_x3,
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
              maxWidth: 324,
            }}
            numberOfLines={1}
          >
            {userInfo.metadata?.tokenId ||
              tinyAddress(selectedWallet?.address, 24) ||
              ""}
          </BrandText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: layout.spacing_x3,
        }}
      >
        <WalletDashboardHeaderCard
          {...{
            title: "Total Balance",
            data: `$${(availableUSDBalance + delegationsUsdBalance).toFixed(
              2,
            )}`,
          }}
        />
        <WalletDashboardHeaderCard
          {...{
            title: "Staked",
            data: `$${delegationsUsdBalance.toFixed(2)}`,
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
