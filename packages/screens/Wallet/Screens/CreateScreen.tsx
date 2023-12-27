import { Video } from "expo-av";
import { ResizeMode } from "expo-av/src/Video.types";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

import { ConnectAdenaButton } from "../../../components/connectWallet/ConnectAdenaButton";
import { ConnectKeplrButton } from "../../../components/connectWallet/ConnectKeplrButton";
import { ConnectLeapButton } from "../../../components/connectWallet/ConnectLeapButton";
import { ConnectMetamaskButton } from "../../../components/connectWallet/ConnectMetamaskButton";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { Button } from "../components/Button";
import { WalletContainer } from "../layout/WalletContainer";

function Connect3rdPartyWallet() {
  return (
    <>
      <ConnectMetamaskButton /> <ConnectKeplrButton />
      <ConnectLeapButton /> <ConnectAdenaButton />
    </>
  );
}

export const CreateScreen: ScreenFC<"NativeWallet"> = () => {
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
      <Video
        ref={video}
        shouldPlay
        isLooping
        resizeMode={ResizeMode.CONTAIN}
        style={{
          flex: 4,
          height: "100%",
          width: "100%",
          borderWidth: 1,
          marginBottom: layout.spacing_x2,
        }}
      />
      <View
        style={{
          width: "100%",
          flex: 1,
          marginTop: layout.spacing_x3,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button text="Create Wallet" navigateTo="NativeWallet" />
        <Button text="Import Wallet" navigateTo="ImportWallet" />
        <Button text="Connect Ledger" navigateTo="NativeWallet" />
        {Platform.OS === "web" && <Connect3rdPartyWallet />}
      </View>

      {/*<BrandText style={styles.title}>Create Wallet</BrandText>*/}
      {/*<BrandText style={styles.description}>*/}
      {/*  Create a new wallet to start using Teritori_*/}
      {/*</BrandText>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<PrimaryButton*/}
      {/*  text="Create Wallet"*/}
      {/*  onPress={wrapWithFeedback(createWallet)}*/}
      {/*/>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<PrimaryButton*/}
      {/*  text="Save Wallet"*/}
      {/*  onPress={wrapWithFeedback(saveWallet)}*/}
      {/*/>*/}
      {/*<PrimaryButton*/}
      {/*  text="Connect Ledger"*/}
      {/*  onPress={wrapWithFeedback(getLedgerAccountDetails)}*/}
      {/*/>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<BrandText style={styles.description}>*/}
      {/*  {seed && JSON.stringify(seed)}*/}
      {/*</BrandText>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<BrandText style={styles.description}>*/}
      {/*  {myAddress && JSON.stringify(myAddress)}*/}
      {/*</BrandText>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<BrandText style={styles.description}>*/}
      {/*  {myWallet && JSON.stringify(myWallet)}*/}
      {/*</BrandText>*/}
      {/*<SpacerColumn size={3} />*/}
      {/*<BrandText style={styles.description}>*/}
      {/*  {mySigner && JSON.stringify(mySigner)}*/}
      {/*</BrandText>*/}
    </WalletContainer>
  );
};
