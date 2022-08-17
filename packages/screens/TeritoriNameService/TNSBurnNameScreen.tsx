import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, View } from "react-native";

import burnPNG from "../../../assets/icons/burn.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { NameNFT } from "../../components/TeritoriNameService/NameNFT";
import { DarkButton } from "../../components/buttons/DarkButton";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { defaultExecuteFee } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";

export const TNSBurnNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSUpdateName">;
}> = ({ route }) => {
  const { name, setName, setTnsError, setTnsSuccess } = useContext(TNSContext);
  const { tokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const navigation = useAppNavigation();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const normalizedTokenId = (name + process.env.TLD).toLowerCase();

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from TNSContext. Redirects to TNSHome if this screen is called when the user doesn't own the token
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful TODO: Still redirects to TNSHome, weird..
    if (
      (name &&
        tokens.length &&
        (!userHasCoWallet || !isTokenOwnedByUser(tokens, name))) ||
      !isKeplrConnected
    ) {
      navigation.navigate("TNSHome");
    }
  });

  const onSubmit = async () => {
    const msg = {
      burn: {
        token_id: normalizedTokenId,
      },
    };
    try {
      const signingClient = await getSigningCosmWasmClient();

      const walletAddress = (await getFirstKeplrAccount()).address;

      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId + " successfully burnt");
        setTnsSuccess({
          title: normalizedTokenId + " successfully burnt",
          message: "",
        });
        navigation.navigate("TNSManage");
      }
    } catch (e) {
      // TODO env var for dev logging (?)
      setTnsError({
        title: "Something went wrong!",
        message: e.message,
      });
      console.warn(e);
    }
  };

  return (
    <ScreenContainer2
      footerChildren={
        <BacKTo label={name} navItem="TNSConsultName" navParams={{ name }} />
      }
    >
      <View
        style={{
          flex: 1,
          marginTop: 32,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <NameNFT name={name} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            height: 404,
            maxHeight: 404,
            minHeight: 404,
            width: "100%",
            maxWidth: 396,
            borderColor: neutral33,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#000000",
            padding: 24,
            marginLeft: 20,
          }}
        >
          <View>
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "row" }}
            >
              <Image
                source={burnPNG}
                style={{ width: 32, height: 32, marginRight: 16 }}
              />
              <BrandText style={{ fontSize: 32, lineHeight: 44 }}>
                Burn {name}
              </BrandText>
            </View>
            <BrandText
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: "#A3A3A3",
                marginTop: 16,
              }}
            >
              This will permanently destroy the token. The token will no longer
              be visible from the name service and another token with the same
              name will be mintable.
            </BrandText>
          </View>

          <DarkButton
            text="I understand, burn it"
            onPress={onSubmit}
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </ScreenContainer2>
  );
};
