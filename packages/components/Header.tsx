import logoTopPNG from "../../assets/logo-top.png"

{/*TODO: STEP3*/}

import React from "react";
import {
  View,
  Image,
  TouchableOpacity, ImageSourcePropType, ViewStyle, ImageStyle
} from "react-native"

import {useAppNavigation } from "../utils/navigation";
import {headerHeight} from "../utils/layout"
import {WalletSelector} from "./WalletSelector"
import {PrimaryButton} from "./buttons/PrimaryButton"
import {SecondaryButton} from "./buttons/SecondaryButton"
import flowCardPNG from "../../assets/cards/flow-card.png"
import secondaryCardSmPNG from "../../assets/cards/secondary-card-sm.png"
import {BrandText} from "./BrandText"


// Displayed when no wallet connected. Press to connect wallet
const ConnectWalletButton: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const height = 40
  const fontSize = 14

  return (
    <TouchableOpacity style={style} onPress={() => {/*TODO:*/}}>
      <Image
        source={secondaryCardSmPNG}
        style={{width: 220, height, resizeMode: "stretch"}}
      />

      <View style={{
        flex: 1, alignItems: "center", justifyContent: "center",
        position: "absolute",
        height, width: "100%",
        top: `calc(50% - ${height}px / 2)`
      }}>
        <BrandText
          style={{
            fontSize: fontSize,
            letterSpacing: -(fontSize * 0.04)
          }}
        >
          Connect wallet
        </BrandText>
      </View>
    </TouchableOpacity>
  )
}

{/*TODO: Is it a good name for this cpt ?*/}
export const Header: React.FC = () => {
  const navigation = useAppNavigation();
  const headerMarginH = 22

  return (
    <View
      style={{
        height: headerHeight, maxHeight: headerHeight,
        width: "100%",
        flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          source={logoTopPNG}
          style={{
            width: 68,
            height: 68,
            resizeMode: "contain",
            marginLeft: headerMarginH
          }}
        />
      </TouchableOpacity>

      {/*<SecondaryButton*/}
      {/*  text="Connect Wallet"*/}
      {/*  onPress={() => navigation.navigate("Mint")}*/}
      {/*/>*/}

      <ConnectWalletButton style={{ marginRight: headerMarginH}}/>




      {/*<WalletSelector style={{ marginRight: 22}}/>*/}

    </View>
  );
};
