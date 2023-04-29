import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { WalletHeader } from "./WalletHeader";
import { WalletItem } from "./WalletItem";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletProviderIcon } from "../../components/WalletProviderIcon";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ConnectWalletModal } from "../../components/connectWallet/ConnectWalletModal";
import {
  Wallet as WalletType,
  useWallets,
} from "../../context/WalletsProvider";
import { ScreenFC } from "../../utils/navigation";
import { neutral33, neutralA3, secondaryColor } from "../../utils/style/colors";
import { WalletProvider } from "../../utils/walletProvider";

interface WalletProviderViewProps {
  index: number;
  itemsCount: number;
  provider: WalletProvider;
  wallets: WalletType[];
}

const WalletProviderView: React.FC<WalletProviderViewProps> = ({
  wallets,
  provider,
  index,
  itemsCount,
}) => {
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
            <WalletProviderIcon walletProvider={provider} size={32} />
            <BrandText
              style={{
                marginLeft: 12,
                fontSize: 20,
              }}
            >
              {provider}
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
          {wallets.map((subItem, index) => (
            <WalletItem
              key={subItem.id}
              itemsCount={wallets.length}
              wallet={subItem}
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
  const { wallets } = useWallets();

  const byProvider = wallets.reduce((all, w) => {
    if (!all[w.provider]) {
      all[w.provider] = [];
    }
    all[w.provider].push(w);
    return all;
  }, {} as { [key in WalletProvider]: WalletType[] });

  return (
    <ScreenContainer headerChildren={<WalletHeader />}>
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
              Manage wallets
            </BrandText>
          </View>
          <PrimaryButton
            size="SM"
            text="Add wallet"
            onPress={() => setShowConnectModal(true)}
          />
        </View>

        {Object.entries(byProvider).map(([provider, wallets], index) => (
          <WalletProviderView
            key={provider}
            wallets={wallets}
            provider={provider as WalletProvider}
            index={index}
            itemsCount={Object.keys(byProvider).length}
          />
        ))}
      </View>
      <ConnectWalletModal
        visible={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </ScreenContainer>
  );
};
