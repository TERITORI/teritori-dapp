import { Video } from "expo-av";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

import astroSvg from "../../../../assets/icons/networks/astroport-circle.svg";
import connectWalletSvg from "../../../../assets/icons/networks/connect-wallet-circle.svg";
import foxSvg from "../../../../assets/icons/networks/fox-circle.svg";
import keplerSvg from "../../../../assets/icons/networks/kepler-circle.svg";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { ConnectAdenaButton } from "../../../components/connectWallet/ConnectAdenaButton";
import { ConnectKeplrButton } from "../../../components/connectWallet/ConnectKeplrButton";
import { ConnectLeapButton } from "../../../components/connectWallet/ConnectLeapButton";
import { ConnectMetamaskButton } from "../../../components/connectWallet/ConnectMetamaskButton";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../../Mini/components/Button/CustomButton";
import { WalletContainer } from "../layout/WalletContainer";

function Connect3rdPartyWallet() {
  return (
    <>
      <ConnectMetamaskButton /> <ConnectKeplrButton />
      <ConnectLeapButton /> <ConnectAdenaButton />
    </>
  );
}

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
    img: astroSvg,
    name: "astroport",
  },
  {
    img: connectWalletSvg,
    name: "connectWallet",
  },
];

const NativeWallet: ScreenFC<"NativeWallet"> = () => {
  const video = React.useRef(null);

  useEffect(() => {
    if (video.current) {
      // @ts-ignore
      video.current.unloadAsync().then(() => {
        // @ts-ignore
        video.current.loadAsync(
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
          <SpacerColumn size={1.5} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <CustomButton
              onPress={(_, navigation) => {
                navigation.navigate("ImportWallet");
              }}
              title="Import Wallet"
              style={{ flex: 1 }}
              type="outline"
            />
            <CustomButton
              onPress={(_, navigation) => {
                navigation.navigate("ConnectLedger");
              }}
              title="Connect Ledger"
              style={{ flex: 1 }}
              type="outline"
            />
          </View>

          <SpacerColumn size={3} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            {wallets.map((wallet) => {
              return <SVGorImageIcon icon={wallet.img} iconSize={42} />;
            })}
          </View>
          <SpacerColumn size={8} />
          {Platform.OS === "web" && <Connect3rdPartyWallet />}
        </View>
      </View>
    </WalletContainer>
  );
};

export default NativeWallet;
