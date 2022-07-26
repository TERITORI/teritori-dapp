import {RouteProp, useFocusEffect} from "@react-navigation/native"
import React, {useContext, useEffect} from "react"
import { Image, View } from "react-native";

import burnPNG from "../../../assets/icons/burn.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { NameNFT } from "../../components/NameServiceBooking/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { DarkButton } from "../../components/buttons/DarkButton";
import { NSBContext } from "../../context/NSBProvider";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { neutral33 } from "../../utils/colors";
import {RootStackParamList, useAppNavigation} from "../../utils/navigation"
import {useSigningClient} from "../../context/cosmwasm"
import {Metadata} from "../../utils/types/messages"
import {useSigningCosmWasmClient} from "../../hooks/cosmwasm"
import {defaultExecuteFee} from "../../utils/fee"
import {defaultMemo} from "../../utils/memo"
import {useTokenList} from "../../hooks/tokens"
import {isTokenOwned} from "../../utils/handefulFunctions"

export const NSBBurnNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">
}> = ({route}) => {
  const { name, setName, setNsbError } = useContext(NSBContext);
  const { signingClient, walletAddress } = useSigningClient()
  const { connectWallet } = useSigningCosmWasmClient();
  const userHasCoWallet = useHasUserConnectedWallet();
  const { tokens } = useTokenList();


  const navigation = useAppNavigation();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the user doesn't own the token
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name)
    // ===== Controls many things, be careful
    if ((name && tokens.length && (!userHasCoWallet || !isTokenOwned(tokens, name)) || !signingClient) ) {
      navigation.navigate("NSBHome");
    }
  });

  const onSubmit = async () => {
    // setLoading(true)
    const msg = {
      burn: {
        token_id: name,
      },
    }
    try {
      let updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (updatedToken) {
        navigation.navigate("NSBManage")
        // setLoading(false)
      }
    } catch (e) {
      // TODO env var for dev logging (?)
      setNsbError({
        title: "Something went wrong!",
        message: e.message,
      });
      console.warn(e);
      // setLoading(false)
    }
  }

  return (
    <ScreenContainer2
      footerChildren={<BacKTo label={name} navItem="NSBConsultName" navParams={{name}}/>}
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
