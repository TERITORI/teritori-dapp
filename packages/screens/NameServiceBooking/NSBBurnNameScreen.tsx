import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

import burnPNG from "../../../assets/icons/burn.png";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { NameNFT } from "../../components/teritorinameService/NameNFT";
import { FeedbacksContext } from "../../context/FeedbacksProvider";
import { NSBContext } from "../../context/NSBProvider";
import { useTokenList } from "../../hooks/tokens";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { useStore } from "../../store/cosmwasm";
import { defaultExecuteFee } from "../../utils/fee";
import { isTokenOwned, normalizedTokenId } from "../../utils/handefulFunctions";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";

export const NSBBurnNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">;
}> = ({ route }) => {
  const { name, setName } = useContext(NSBContext);
  const { setToastError, setToastSuccess, setLoadingFullScreen } =
    useContext(FeedbacksContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useHasUserConnectedWallet();
  const navigation = useAppNavigation();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the user doesn't own the token
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful TODO: Still redirects to NSBHome, weird..
    if (
      (name &&
        tokens.length &&
        (!userHasCoWallet || !isTokenOwned(tokens, name))) ||
      !signingClient
    ) {
      navigation.navigate("NSBHome");
    }
  });

  const onSubmit = async () => {
    setLoadingFullScreen(true);

    const msg = {
      burn: {
        token_id: normalizedTokenId(name),
      },
    };
    try {
      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId(name) + " successfully burnt");
        setToastSuccess({
          title: normalizedTokenId(name) + " successfully burnt",
          message: "",
        });
        navigation.navigate("NSBManage");
        setLoadingFullScreen(false);
      }
    } catch (e) {
      // TODO env var for dev logging (?)
      setToastError({
        title: "Something went wrong!",
        message: e.message,
      });
      console.warn(e);
      setLoadingFullScreen(false);
    }
  };

  return (
    <ScreenContainer
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
      footerChildren={
        <BackTo
          label={"Back to " + name}
          navItem="NSBConsultName"
          navParams={{ name }}
        />
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

          <SecondaryButton
            height={48}
            text="I understand, burn it"
            onPress={onSubmit}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
