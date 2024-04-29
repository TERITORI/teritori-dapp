import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import dappCardSVG from "@/assets/cards/dapp-card.svg";
import iconSVG from "@/assets/icons/fire.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ConnectWalletButton } from "@/components/TopMenu/ConnectWalletButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import useSelectedWallet from "@/hooks/useSelectedWallet";

const gridHalfGutter = 12;

export const TopSectionConnectWallet: React.FC<object> = () => {
  const selectedWallet = useSelectedWallet();

  const label = "The Great Cleansing";
  const description =
    "Take a chance to participate in the Burn Capital Whitelist by burning your rugged projects NFTs. 1 burned NFT = 1 Point.";
  const labelFontSize = 20;
  const descriptionFontSize = 14;
  const borderRadius = 20;
  const width = 528;
  const height = 302;
  console.log("selectedWallet", selectedWallet);

  return (
    <View style={{ margin: gridHalfGutter }}>
      <SVG
        width={width}
        height={height}
        source={dappCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
          width,
          height,
          flexDirection: "row",
          justifyContent: "flex-start",
          borderRadius,
          alignItems: "center",
        }}
      >
        <SVG
          width={40}
          height={40}
          source={iconSVG}
          style={{ marginLeft: 115, position: "absolute" }}
        />
        <View
          style={{
            width,
            height,
            flexDirection: "row",
            justifyContent: "flex-start",
            borderRadius,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingTop: 50,
              paddingRight: 20,
              paddingBottom: 18,
              paddingLeft: 210,
              height,
            }}
          >
            <BrandText
              style={{
                color: "white",
                fontSize: labelFontSize,
                letterSpacing: -(labelFontSize * 0.04),
              }}
            >
              {label}
            </BrandText>
            <View>
              <BrandText
                style={{
                  color: "#A3A3A3",
                  fontSize: descriptionFontSize,
                  paddingTop: 10,
                  fontWeight: "500",
                  letterSpacing: -(descriptionFontSize * 0.04),
                }}
              >
                {description}
              </BrandText>
            </View>
          </View>
        </View>
      </View>
      {/*<ConnectWalletButton/>*/}
      <MainConnectWalletButton
        style={{
          width: 528,
        }}
      />
    </View>
  );
};
