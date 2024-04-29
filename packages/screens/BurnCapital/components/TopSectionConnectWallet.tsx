import React from "react";
import { View } from "react-native";

import dappCardSVG from "@/assets/cards/dapp-card.svg";
import iconSVG from "@/assets/icons/fire.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { shortUserAddressFromID } from "@/components/nfts/NFTView";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { fontBold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const gridHalfGutter = 12;

export const TopSectionConnectWallet: React.FC<object> = () => {
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);

  const label = "The Great Cleansing";
  const description =
    "Take a chance to participate in the Burn Capital Whitelist by burning your rugged projects NFTs. 1 burned NFT = 1 Point.";
  const labelFontSize = 20;
  const descriptionFontSize = 14;
  const borderRadius = 20;
  const width = 528;
  const height = 302;

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

      {selectedWallet?.address ? (
        <View
          style={{
            // flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            height: 130,
          }}
        >
          {userInfo.metadata.tokenId && (
            <>
              <BrandText
                style={[fontBold16, { marginRight: layout.spacing_x2 }]}
              >
                Connected As
              </BrandText>
              <UserAvatarWithFrame
                userId={selectedWallet?.userId || ""}
                size="M"
                style={{
                  marginRight: 6,
                }}
              />
              <>
                <BrandText
                  style={{
                    fontSize: layout.spacing_x2,
                    lineHeight: 16,
                  }}
                >
                  {userInfo.metadata?.tokenId ||
                    shortUserAddressFromID(userInfo.metadata.tokenId, 10)}
                </BrandText>
              </>
            </>
          )}
        </View>
      ) : (
        <MainConnectWalletButton
          style={{
            width: 528,
          }}
        />
      )}
    </View>
  );
};
