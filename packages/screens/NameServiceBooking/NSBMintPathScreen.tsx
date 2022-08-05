import { RouteProp, useFocusEffect } from "@react-navigation/native";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BacKTo } from "../../components/Footer";
import { NameDataForm } from "../../components/NameServiceBooking/NameDataForm";
import { NameNFT } from "../../components/NameServiceBooking/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { NSBContext } from "../../context/NSBProvider";
import { useSigningClient } from "../../context/cosmwasm";
import { useSigningCosmWasmClient } from "../../hooks/cosmwasm";
import { useTokenList } from "../../hooks/tokens";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import { isTokenOwned, tokenWithoutTld } from "../../utils/handefulFunctions";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { defaultMetaData, Metadata } from "../../utils/types/messages";

const normalize = (inputString: string) => {
  const invalidChrsRemoved = R.replace(/[^a-z0-9\-\_]/g, "", inputString);
  return R.replace(/[_\-]{2,}/g, "", invalidChrsRemoved);
};

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBMintPathScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName, setNsbError, setNsbSuccess, setNsbLoading } =
    useContext(NSBContext);
  const { tokens, loadingTokens } = useTokenList();
  const navigation = useAppNavigation();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useHasUserConnectedWallet();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const normalizedTokenId = R.toLower(name + process.env.TLD);

  const initData = async () => {
    // await connectWallet();
    try {
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
      setNsbLoading(false);
      setInitialData(tokenData);
    } catch (e) {
      setInitialized(true);
      setNsbLoading(false);
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // Sync nsbLoading
  useEffect(() => {
    setNsbLoading(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the user doesn't own the token
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
    if (!initialized) {
      setNsbLoading(true);
      initData();
    }
  });

  const submitData = async (_data) => {
    if (!signingClient || !walletAddress) {
      return;
    }
    setNsbLoading(true);
    const {
      token_id: pathId,
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

    const normalizedPathId = normalize(R.toLower(pathId));

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

    try {
      const mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (mintedToken) {
        console.log(normalizedPathId + " successfully minted"); //TODO: redirect to the token
        setNsbSuccess({
          title: normalizedPathId + " successfully minted",
          message: "",
        });
        navigation.navigate("NSBConsult", { name: tokenWithoutTld(pathId) });
        setNsbLoading(false);
      }
    } catch (err) {
      setNsbError({
        title: "Something went wrong!",
        message: err.message,
      });
      console.warn(err);
      setNsbLoading(false);
    }
  };

  return (
    <ScreenContainer2
      footerChildren={
        <BacKTo label={name} navItem="NSBConsultName" navParams={{ name }} />
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
    </ScreenContainer2>
  );
};
