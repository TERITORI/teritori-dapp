import { Video } from "expo-av";
import React, { useEffect } from "react";
import { View } from "react-native";

import { WalletContainer } from "../layout/WalletContainer";

import adena from "@/assets/icons/adena.svg";
import connectWalletSvg from "@/assets/icons/networks/connect-wallet-circle.svg";
import foxSvg from "@/assets/icons/networks/fox-circle.svg";
import keplerSvg from "@/assets/icons/networks/kepler-circle.svg";
import { BrandText } from "@/components/BrandText";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn } from "@/components/spacer";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { ScreenFC } from "@/utils/navigation";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const NativeWallet: ScreenFC<"NativeWallet"> = () => {
  const nativeWallet = useSelectedNativeWallet();

  const video = React.useRef<Video>(null);

  useEffect(() => {
    if (video.current) {
      video.current.unloadAsync().then(() => {
        video?.current?.loadAsync(
          require("../../../../assets/videos/teritori-os-anim-ios.mp4"),
          {
            shouldPlay: true,
          },
        );
      });
    }
  }, []);

  return (
    <WalletContainer>
      <View
        style={{ flex: 1, height: "100%", justifyContent: "space-between" }}
      >
        <Video
          ref={video}
          shouldPlay
          isLooping
          style={{
            flex: 1,
            borderWidth: 1,
            marginBottom: layout.spacing_x2,
          }}
        />
        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <CustomButton
            title="Create Wallet"
            onPress={(_, navigation) => {
              navigation.navigate("CreateWallet");
            }}
          />
          {nativeWallet && (
            <CustomButton
              title="Continue"
              style={{
                marginVertical: layout.spacing_x2,
              }}
              onPress={(_, navigation) => {
                navigation.navigate("MiniTabs", { screen: "MiniChats" });
              }}
            />
          )}
          <SpacerColumn size={1.5} />
          <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
            <CustomButton
              onPress={(_, navigation) => {
                navigation.navigate("ImportWallet");
              }}
              title="Import Wallet"
              style={{ flex: 1 }}
              type="outline"
            />
            {/* Hiding connect ledger option until it is ready for implementation */}
            {/* <CustomButton
              isDisabled={Platform.OS !== "web"}
              onPress={(_, navigation) => {
                navigation.navigate("ConnectLedger");
              }}
              title="Connect Ledger"
              style={{ flex: 1 }}
              type="outline"
            /> */}
          </View>

          <SpacerColumn size={3} />
          <Connect3rdPartyWallet />
          <SpacerColumn size={8} />
        </View>
      </View>
    </WalletContainer>
  );
};

export default NativeWallet;

const Connect3rdPartyWallet: React.FC = () => {
  const wallets = [
    {
      img: foxSvg,
      name: "fox",
    },
    {
      img: keplerSvg,
      name: "kepler",
    },
    {
      img: adena,
      name: "adena",
    },
    {
      img: connectWalletSvg,
      name: "connectWallet",
    },
  ];
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: layout.spacing_x1_5,
      }}
    >
      <BrandText
        style={[
          fontSemibold12,
          {
            textTransform: "uppercase",
          },
        ]}
      >
        Also Available on the Web:
      </BrandText>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {wallets.map((wallet, index) => {
          return <SVGorImageIcon key={index} icon={wallet.img} iconSize={42} />;
        })}
      </View>
    </View>
  );
};
