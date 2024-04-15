import React, { useRef } from "react";
import { useWindowDimensions } from "react-native";
import WebView from "react-native-webview";

import { getKeplrSigningCosmWasmClient } from "../../../networks/signer";
import { safeParseJSON } from "../../../utils/sanitize";
import { getNativeWallet } from "../../../utils/wallet/getNativeWallet";

import { ScreenContainer } from "@/components/ScreenContainer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { ScreenFC } from "@/utils/navigation";

export const ExplorerScreen: ScreenFC<"Explorer"> = () => {
  const { width, height } = useWindowDimensions();
  const webViewRef = useRef<WebView>(null);
  const selectedWallet = useSelectedWallet();

  const networkId = selectedWallet?.networkId;
  const handleMessage = async (data) => {
    const parsedData: any = safeParseJSON(data);
    if (parsedData.log) {
      console.log("logger", parsedData.message);
      return;
    }

    console.log("Parsed data", parsedData);
    switch (parsedData?.type) {
      case "getAccounts": {
        try {
          const wallet = await getNativeWallet("tori", 1);
          const accounts = await wallet.getAccounts();

          const toSendData = JSON.stringify({
            id: parsedData.id,
            response: true,
            data: accounts,
          });

          console.log("tosend data", toSendData);

          webViewRef.current?.postMessage(toSendData);
        } catch (err) {
          webViewRef.current?.postMessage(
            JSON.stringify({
              id: parsedData.id,
              response: false,
              error: err?.message,
            }),
          );
        }
        break;
      }
      case "execute": {
        try {
          console.log("networkID", networkId);
          const client = await getKeplrSigningCosmWasmClient(networkId);
          console.log(JSON.stringify(parsedData.data));

          const data = await client.execute(...parsedData.data);
          webViewRef.current?.postMessage(
            JSON.stringify({
              id: parsedData.id,
              response: true,
              data,
            }),
          );
        } catch (err) {
          console.log("execute err", err);
          webViewRef.current?.postMessage(
            JSON.stringify({
              id: parsedData.id,
              response: false,
              error: err?.message,
            }),
          );
        }
      }
    }
  };

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Explorer"
    >
      <WebView
        source={{ uri: "http://localhost:8081/feed" }}
        style={{
          flex: 1,
          height,
          width,
        }}
        ref={webViewRef}
        onMessage={(event) => handleMessage(event.nativeEvent.data)}
        mixedContentMode="always"
      />
    </ScreenContainer>
  );
};
