import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { NameDataFormType } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { defaultMintFee } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { isTokenOwnedByUser, tokenWithoutTld } from "../../utils/tns";
import { defaultMetaData, Metadata } from "../../utils/types/tns";

const normalize = (inputString: string) => {
  const invalidChrsRemoved = inputString.replace(/[^a-z0-9\-_]/g, "");
  return invalidChrsRemoved.replace(/[_-]{2,}/g, "");
};

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintPathScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSMintPath">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } = useTNS();
  const { setLoadingFullScreen, setToastError, setToastSuccess } =
    useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const normalizedTokenId = (name + process.env.TLD).toLowerCase();

  const initData = async () => {
    try {
      const signingClient = await getSigningCosmWasmClient();

      // If this query fails it means that the token does not exist.
      const token = await signingClient.queryContractSmart(contractAddress, {
        nft_info: {
          token_id: normalizedTokenId,
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
    // ---- Setting the name from TNSContext. Redirects to TNSHome if this screen is called when the user doesn't own the token
    // @ts-expect-error
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful
    if (
      (name &&
        tokens.length &&
        (!userHasCoWallet || !isTokenOwnedByUser(tokens, name))) ||
      !isKeplrConnected
    ) {
      navigation.navigate("TNSHome");
    }
    if (!initialized) {
      setLoadingFullScreen(true);
      initData();
    }
  });

  // FIXME: typesafe data
  const submitData = async (data: any) => {
    if (!isKeplrConnected) {
      return;
    }
    setLoadingFullScreen(true);
    const {
      token_id: pathId,
      image, // TODO - support later
      // image_data
      email,
      external_url,
      // public_name, // Useless because TNSContext ?
      public_bio,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    } = data;

    const normalizedPathId = normalize(pathId.toLowerCase());

    try {
      const walletAddress = (await getFirstKeplrAccount()).address;

      const msg = {
        update_metadata: {
          owner: walletAddress,
          token_id: normalizedPathId,
          token_uri: null, // TODO - support later
          extension: {
            image,
            image_data: null, // TODO - support later
            email,
            external_url,
            public_name: normalizedPathId,
            public_bio,
            twitter_id,
            discord_id,
            telegram_id,
            keybase_id,
            validator_operator_address,
            parent_token_id: normalizedTokenId,
          },
        },
      };

      const signingClient = await getSigningCosmWasmClient();

      const mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (mintedToken) {
        console.log(normalizedPathId + " successfully minted"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedPathId + " successfully minted",
          message: "",
        });
        navigation.navigate("TNSConsultName", {
          name: tokenWithoutTld(pathId),
        });
        setLoadingFullScreen(false);
      }
    } catch (err) {
      console.warn(err);
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = `${err}`;
      }
      setToastError({
        title: "Something went wrong!",
        message,
      });
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
          navItem="TNSConsultName"
          navParams={{ name }}
        />
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
            btnLabel="Create path"
            onPressBtn={submitData}
            initialData={initialData}
            isMintPath
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
