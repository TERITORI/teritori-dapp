import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../../components/BrandText";
import { SecondaryButton } from "../../../../components/buttons/SecondaryButton";
import { ConnectWalletModal } from "../../../../components/connectWallet/ConnectWalletModal";
import { BackButton } from "../../../../components/navigation/components/BackButton";
import { SpacerRow } from "../../../../components/spacer";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { selectIsLightTheme } from "../../../../store/slices/settings";
import { headerHeight, layout } from "../../../../utils/style/layout";

export type HeaderProps = {
  headerTitle: string;
  onBackPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ headerTitle, onBackPress }) => {
  const isLightTheme = useSelector(selectIsLightTheme);
  const [isConnectWalletVisible, setIsConnectWalletVisible] =
    React.useState(false);
  const selectedWallet = useSelectedWallet();

  return (
    <View
      style={{
        flex: 1,
        height: headerHeight,
        width: "100%",
        maxHeight: headerHeight,
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderBottomColor: "#EBEBF0",
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: layout.contentSpacing,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <SpacerRow size={8} />
          {onBackPress && <BackButton onPress={onBackPress} />}
          <BrandText
            style={{ letterSpacing: -1, marginLeft: 20, fontSize: 20 }}
          >
            {headerTitle}
          </BrandText>
        </View>
        {selectedWallet ? (
          <View style={{ marginRight: 18 }}>
            <SecondaryButton
              textStyle={{ fontWeight: "200" }}
              backgroundColor="#000"
              color="#FFF"
              text="My Account"
              squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
              size="SM"
              width={188}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                textStyle={{ fontWeight: "200" }}
                backgroundColor="#E5E5E8"
                color="#000"
                text="Register"
                squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
                size="SM"
                width={188}
              />
            </View>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                textStyle={{ fontWeight: "200" }}
                backgroundColor="#3063D3"
                color="#FFF"
                text="Sign in"
                squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
                size="SM"
                width={188}
                onPress={() => setIsConnectWalletVisible(true)}
              />
              <ConnectWalletModal
                visible={isConnectWalletVisible}
                onClose={() => setIsConnectWalletVisible(false)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
