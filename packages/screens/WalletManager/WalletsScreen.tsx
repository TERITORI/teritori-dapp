import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { neutral33, neutralA3 } from "../../utils/style/colors";
import { getIconFromTitle } from "./Overview/TokenAllocation";
import { WalletItem } from "./WalletItem";
import { WalletSidebar } from "./WalletSidebar";
const ALL_WALLETS = [
  {
    title: "Teritori",
    data: [
      {
        id: 1,
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: true,
      },
      {
        id: 2,
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: false,
      },
    ],
  },
  {
    title: "Cosmos Hub",
    data: [
      {
        id: 3,
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: true,
      },
      {
        id: 4,
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: false,
      },
    ],
  },
  {
    title: "Terra",
    data: [
      {
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: true,
      },
      {
        staked: 535053.812943,
        pendingReward: 56469.54635563,
        address: "GxF3432432904320430SDSDSFDS@S>!3A31",
        isDefault: false,
      },
    ],
  },
];

const Wallet: React.FC = ({ item }) => {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <TertiaryBox
      fullWidth
      mainContainerStyle={{
        marginBottom: 12,
      }}
    >
      <TertiaryBox
        fullWidth
        mainContainerStyle={{
          backgroundColor: neutral33,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG source={getIconFromTitle(item.title)} height={32} width={32} />
          <BrandText
            style={{
              marginLeft: 12,
              fontSize: 20,
            }}
          >
            {item.title}
          </BrandText>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded((prev) => !prev)}
          style={{
            paddingVertical: 4,
            paddingLeft: 8,
          }}
        >
          <SVG source={isExpanded ? chevronUpSVG : chevronDownSVG} />
        </TouchableOpacity>
      </TertiaryBox>
      {!!isExpanded && (
        <View
          style={{
            width: "100%",
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}
        >
          {item.data.map((subItem, index) => (
            <WalletItem
              key={subItem.id}
              totalLength={item.data.length}
              item={{ ...subItem, title: item.title }}
              index={index}
            />
          ))}
        </View>
      )}
    </TertiaryBox>
  );
};
export const WalletMangerWalletsScreen: React.FC = () => {
  return (
    <ScreenContainer hideSidebar customSidebar={<WalletSidebar />}>
      <View
        style={{
          paddingVertical: 48,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <View>
            <BrandText style={{ marginRight: 20, fontSize: 20 }}>
              All Wallets
            </BrandText>
            <BrandText
              style={{
                fontSize: 14,
                color: neutralA3,
              }}
            >
              Add one or more wallets to showcase all related things in one
              place.
            </BrandText>
          </View>
          <PrimaryButton size="SM" text="Add wallet" onPress={() => {}} />
        </View>

        {ALL_WALLETS.map((item) => (
          <Wallet key={item.title} item={item} />
        ))}
      </View>
    </ScreenContainer>
  );
};
