import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { NameDataForm } from "../../components/nameService/NameDataForm";
import { NameNFT } from "../../components/nameService/NameNFT";
import { NSBContext } from "../../context/NSBProvider";
import { useTokenList } from "../../hooks/tokens";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee } from "../../utils/fee";
import {isTokenOwned, normalizedTokenId} from "../../utils/handefulFunctions"
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { defaultMetaData, Metadata } from "../../utils/types/messages";
import {FeedbacksContext} from "../../context/FeedbacksProvider"
import {ScreenContainer} from "../../components/ScreenContainer"
import {BackTo} from "../../components/navigation/BackTo"

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBUpdateNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } =
    useContext(NSBContext);
  const { setLoadingFullScreen, setToastSuccess, setToastError } = useContext(FeedbacksContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useHasUserConnectedWallet();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const navigation = useAppNavigation();

  const initData = async () => {
    try {
      // If this query fails it means that the token does not exist.
      const token = await signingClient.queryContractSmart(contractAddress, {
        nft_info: {
          token_id: name + process.env.TLD,
        },
      });
      // return token.extension;
      const tokenData: Metadata = {
        image: token.extension.image,
        image_data: token.extension.image_data,
        email: token.extension.email,
        external_url: token.extension.external_url,
        public_name: token.extension.public_name,
        public_bio: token.extension.public_bio,
        twitter_id: token.extension.twitter_id,
        discord_id: token.extension.discord_id,
        telegram_id: token.extension.telegram_id,
        keybase_id: token.extension.keybase_id,
        validator_operator_address: token.extension.validator_operator_address,
      };
      setInitialized(true);
      setLoadingFullScreen(false);
      setInitialData(tokenData);
    } catch {
      setInitialized(true);
      setLoadingFullScreen(false);
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the user doesn't own the token.
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful
    if (
      (name &&
        tokens.length &&
        (!userHasCoWallet || !isTokenOwned(tokens, name))) ||
      !signingClient
    ) {
      navigation.navigate("NSBHome");
    }
    if (!initialized) initData();
  });

  const submitData = async (_data) => {
    if (!signingClient || !walletAddress) {
      return;
    }
    setLoadingFullScreen(true);
    const {
      image, // TODO - support later
      // image_data
      email,
      external_url,
      // public_name, // Useless because NSBContext ?
      public_bio,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    } = _data;

    const msg = {
      update_metadata: {
        token_id: normalizedTokenId(name),
        metadata: {
          image,
          image_data: null, // TODO - support later
          email,
          external_url,
          public_name: name + process.env.TLD,
          public_bio,
          twitter_id,
          discord_id,
          telegram_id,
          keybase_id,
          validator_operator_address,
        },
      },
    };

    try {
      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId(name) + " successfully updated"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedTokenId(name) + " successfully updated",
          message: "",
        });
        navigation.navigate("NSBConsultName", { name });
        setLoadingFullScreen(false);
      }
    } catch (err) {
      setToastError({
        title: "Something went wrong!",
        message: err.message,
      });
      console.warn(err);
      setLoadingFullScreen(false);
    }
  };

  return (
    <ScreenContainer hideSidebar headerStyle={{borderBottomColor: "transparent"}}
      footerChildren={
        <BackTo label={"Back to " + name} navItem="NSBConsultName" navParams={{ name }} />
      }
    >
      <View style={{ flex: 1, alignItems: "center", marginTop: 32 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <NameNFT style={{ marginRight: 20 }} name={name} />

          <NameDataForm
            btnLabel="Update profile"
            onPressBtn={submitData}
            initialData={initialData}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
