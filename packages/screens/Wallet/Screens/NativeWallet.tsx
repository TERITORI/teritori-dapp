import { Video } from "expo-av";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

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
          <SpacerColumn size={1} />
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

          {Platform.OS === "web" && <Connect3rdPartyWallet />}
          <SpacerColumn size={10} />
        </View>
      </View>
    </WalletContainer>
  );
};

export default NativeWallet;
