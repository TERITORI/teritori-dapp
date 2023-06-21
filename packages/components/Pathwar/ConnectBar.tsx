import React from "react";
import { Linking, View } from "react-native";
import informationBlueIcon from "../../../assets/icons/Pathwar/informationBlueIcon.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { neutral00, neutral17, primaryColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { Window as KeplrWindow } from "@keplr-wallet/types/build/window";
import { getCosmosNetwork, selectableCosmosNetworks } from "../../networks";
import { setPathwarToken } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";

export const ConnectBar: React.FC<object> = () => {
  const dispatch = useAppDispatch();
  const networkId = useSelectedNetworkId();
  const register = async () => {
    const keplr = (window as KeplrWindow)?.keplr;
    if (!keplr) {
      Linking.openURL(
        "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap"
      );
      return;
    }

    let network = getCosmosNetwork(networkId);
    if (!network) {
      if (selectableCosmosNetworks.length) {
        network = selectableCosmosNetworks[0];
      }
    }
    if (!network) {
      throw new Error("no suitable network");
    }

    await keplr.enable(network.chainId);
    const offlineSigner = keplr.getOfflineSigner(network.chainId);
    const accounts = await offlineSigner.getAccounts();
    const address = accounts[0].address;
    const value = await keplr.signArbitrary(networkId, address, "my message");
    const data = {
      address,
      signed: "my message",
      signature: value.signature,
      pubkey: value.pub_key.value,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const res = await fetch("https://teriwar.mikatech.me/token", requestOptions);
    const json = await res.json();
    dispatch(setPathwarToken(json.token));

    const userRequestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + json.token,
      },
    };

    await fetch("https://poc-api-dev.s2.pmg.tools/user/session", userRequestOptions);
  };

  return (
    <View
      style={{
        backgroundColor: neutral17,
        width: "100%",
        height: 72,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: primaryColor,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: layout.padding_x2_5,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <SVG source={informationBlueIcon} />
          </View>
          <BrandText
            style={[{ marginLeft: layout.padding_x1_5 }, fontSemibold13]}
          >
            Login to play challenges and learn hacking.
          </BrandText>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexDirection: "row",
            marginRight: layout.padding_x1,
          }}
        >
          <View style={{ marginRight: layout.padding_x1 }}>
            <SecondaryButtonOutline
              size="SM"
              text="Register with Keplr"
              color={secondaryColor}
              backgroundColor={neutral00}
              squaresBackgroundColor={neutral17}
              onPress={() => {
                register().then((r) => console.log("value : ", r));
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
