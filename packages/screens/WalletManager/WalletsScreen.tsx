import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ConnectWalletModal } from "../../components/connectWallet/ConnectWalletModal";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { neutral33, neutralA3, secondaryColor } from "../../utils/style/colors";
import { getWalletIconFromTitle } from "../../utils/walletManagerHelpers";
import { WalletItem, WalletItemProps } from "./WalletItem";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";

interface WalletProps {
  index: number;
  itemsCount: number;
  item: {
    title: string;
    data: WalletItemProps["item"][];
  };
}

const Wallet: React.FC<WalletProps> = ({ item, index, itemsCount }) => {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <TertiaryBox
      fullWidth
      style={{
        zIndex: 10 + itemsCount - index,
        marginBottom: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
        style={{
          width: "100%",
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
            <SVG
              source={getWalletIconFromTitle(item.title)}
              height={32}
              width={32}
            />
            <BrandText
              style={{
                marginLeft: 12,
                fontSize: 20,
              }}
            >
              {item.title}
            </BrandText>
          </View>

          <SVG
            source={isExpanded ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>
      {!!isExpanded && (
        <View
          style={{
            width: "100%",
            paddingVertical: 16,
            paddingHorizontal: 20,
            zIndex: 99,
          }}
        >
          {item.data.map((subItem, index) => (
            <WalletItem
              key={subItem.id}
              itemsCount={item.data.length}
              item={subItem}
              index={index}
            />
          ))}
        </View>
      )}
    </TertiaryBox>
  );
};
export const WalletManagerWalletsScreen: ScreenFC<
  "WalletManagerWallets" | "WalletManagerChains"
> = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const selectedWallet = useSelectedWallet();

  const wallets = selectedWallet
    ? [
        {
          title: "Teritori",
          data: [
            {
              id: 0,
              title: "Teritori",
              address: selectedWallet.address,
              pendingReward: 42,
              staked: 42,
            },
          ],
        },
      ]
    : [];

  return (
    <WalletManagerScreenContainer>
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
          <PrimaryButton
            size="SM"
            text="Add wallet"
            onPress={() => setShowConnectModal(true)}
          />
        </View>

        {wallets.map((item, index) => (
          <Wallet
            key={item.title}
            item={item}
            index={index}
            itemsCount={wallets.length}
          />
        ))}
      </View>
      <ConnectWalletModal
        visible={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </WalletManagerScreenContainer>
  );
};
