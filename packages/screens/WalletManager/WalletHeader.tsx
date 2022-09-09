import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import walletHeaderButtonCardSVG from "../../../assets/cards/wallet-header-button-card.svg";
import walletHeaderCardSVG from "../../../assets/cards/wallet-header-card.svg";
import penSVG from "../../../assets/icons/manage.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import {
  neutral22,
  neutralA3,
  primaryTextColor,
} from "../../utils/style/colors";

interface WalletHeaderProps {
  title: string;
  data: string;
  actionButton?: {
    label: string;
    onPress: () => void;
  };
}

const WalletHeaderCard: React.FC<WalletHeaderProps> = ({
  title,
  data,
  actionButton,
}) => {
  return (
    <View
      style={{
        height: 116,
        width: 200,
        marginLeft: 16,
        position: "relative",
      }}
    >
      <SVG
        width="100%"
        height="100%"
        source={walletHeaderCardSVG}
        style={{ position: "absolute", zIndex: 0 }}
      />
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 12,
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
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
      </View>
      {!!actionButton && (
        <TouchableOpacity
          onPress={actionButton.onPress}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 85,
            position: "absolute",
            bottom: 12,
            right: 12,
          }}
        >
          <SVG
            width="100%"
            height="100%"
            source={walletHeaderButtonCardSVG}
            style={{ position: "absolute", zIndex: 0 }}
          />
          <BrandText
            style={{
              fontSize: 16,
              color: primaryTextColor,
              zIndex: 1,
            }}
          >
            {actionButton.label}
          </BrandText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const WalletHeader: React.FC = () => {
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
        <WalletHeaderCard
          {...{
            title: "Total Balance",
            data: "$500.00",
          }}
        />
        <WalletHeaderCard
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
