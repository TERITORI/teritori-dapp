import { RouteProp, useFocusEffect } from "@react-navigation/native";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BacKTo } from "../../components/Footer";
import { NameDataForm } from "../../components/TeritoriNameService/NameDataForm";
import { NameNFT } from "../../components/TeritoriNameService/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee } from "../../utils/fee";
import { isTokenOwned } from "../../utils/tns";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { defaultMetaData, Metadata } from "../../utils/types/tns";

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSUpdateNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSUpdateName">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName, setTnsError, setTnsSuccess, setTnsLoading } =
    useContext(TNSContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useAreThereWallets();
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
      setTnsLoading(false);
      setInitialData(tokenData);
    } catch {
      setInitialized(true);
      setTnsLoading(false);
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // Sync tnsLoading
  useEffect(() => {
    setTnsLoading(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from TNSContext. Redirects to TNSHome if this screen is called when the user doesn't own the token.
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful
    if (
      (name &&
        tokens.length &&
        (!userHasCoWallet || !isTokenOwned(tokens, name))) ||
      !signingClient
    ) {
      navigation.navigate("TNSHome");
    }
    if (!initialized) initData();
  });

  const submitData = async (_data) => {
    if (!signingClient || !walletAddress) {
      return;
    }
    setTnsLoading(true);
    const {
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
    } = _data;

    const normalizedTokenId = R.toLower(name + process.env.TLD);

    const msg = {
      update_metadata: {
        token_id: normalizedTokenId,
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
        console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
        setTnsSuccess({
          title: normalizedTokenId + " successfully updated",
          message: "",
        });
        navigation.navigate("TNSConsultName", { name });
        setTnsLoading(false);
      }
    } catch (err) {
      setTnsError({
        title: "Something went wrong!",
        message: err.message,
      });
      console.warn(err);
      setTnsLoading(false);
    }
  };

  return (
    <ScreenContainer2
      footerChildren={
        <BacKTo label={name} navItem="TNSConsultName" navParams={{ name }} />
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
    </ScreenContainer2>
  );
};
