import { RouteProp, useFocusEffect } from "@react-navigation/native";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";

import longCardPNG from "../../../assets/cards/long-card.png";
import coinPNG from "../../../assets/icons/coin.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { NameDataForm } from "../../components/TeritoriNameService/NameDataForm";
import { NameNFT } from "../../components/TeritoriNameService/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallet } from "../../hooks/useAreThereWallet";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import { isTokenOwned } from "../../utils/tns";
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { defaultMetaData, Metadata } from "../../utils/types/tns";

const CostContainer: React.FC = () => {
  const innerHeight = 32;

  return (
    <View>
      <Image
        source={longCardPNG}
        style={{ width: 748, height: 80, resizeMode: "stretch" }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          height: innerHeight,
          top: `calc(50% - ${innerHeight}px / 2)`,
        }}
      >
        <Image
          source={coinPNG}
          style={{
            width: 32,
            height: 32,
            resizeMode: "stretch",
            marginLeft: 24,
            marginRight: 12,
          }}
        />

        <BrandText>The mint cost for this token is 1,000 Tori</BrandText>
      </View>
    </View>
  );
};

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSUpdateName">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName, setTnsError, setTnsSuccess, setTnsLoading } =
    useContext(TNSContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useAreThereWallet();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const appendTokenId = useStore((state) => state.appendTokenId);
  const mintCost = getMintCost(name);
  const navigation = useAppNavigation();

  const normalizedTokenId = R.toLower(name + process.env.TLD);

  const initData = async () => {
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
      setInitialData(tokenData);
      setTnsLoading(false);
      setInitialized(true);
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
    // ---- Setting the name from TNSContext. Redirects to TNSManage if this screen is called when the user owns the token. Redirects to TNSHome if no connected wallet
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful
    if (!userHasCoWallet || !signingClient) navigation.navigate("TNSHome");
    if (name && userHasCoWallet && isTokenOwned(tokens, name))
      navigation.navigate("TNSManage");

    if (!initialized) {
      setTnsLoading(true);
      initData();
    }
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

    const msg = {
      mint: {
        owner: walletAddress,
        token_id: normalizedTokenId,
        token_uri: null, // TODO - support later
        extension: {
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
      const mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo,
        mintCost
      );
      if (mintedToken) {
        appendTokenId(normalizedTokenId);
        console.log(normalizedTokenId + " successfully minted");
        setTnsSuccess({
          title: normalizedTokenId + " successfully minted",
          message: "",
        });
        navigation.navigate("TNSConsult", { name });
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
      footerChildren={<BacKTo label="search" navItem="TNSRegister" />}
    >
      <View style={{ flex: 1, alignItems: "center", marginTop: 32 }}>
        <CostContainer />

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
            btnLabel="Create username"
            onPressBtn={submitData}
            initialData={initialData}
          />
        </View>
      </View>
    </ScreenContainer2>
  );
};
