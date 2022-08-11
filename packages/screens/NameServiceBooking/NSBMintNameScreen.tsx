import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";

import longCardPNG from "../../../assets/cards/long-card.png";
import coinPNG from "../../../assets/icons/coin.png";
import { BrandText } from "../../components/BrandText";
import { NameDataForm } from "../../components/nameService/NameDataForm";
import { NameNFT } from "../../components/nameService/NameNFT";
import { NSBContext } from "../../context/NSBProvider";
import { useTokenList } from "../../hooks/tokens";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import {isTokenOwned, normalizedTokenId} from "../../utils/handefulFunctions"
import { defaultMemo } from "../../utils/memo";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { defaultMetaData, Metadata } from "../../utils/types/messages";
import {FeedbacksContext} from "../../context/FeedbacksProvider"
import {ScreenContainer} from "../../components/ScreenContainer"
import {BackTo} from "../../components/navigation/BackTo"

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
export const NSBMintNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">;
}> = ({ route }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } =
    useContext(NSBContext);
  const { setLoadingFullScreen, setToastError, setToastSuccess } = useContext(FeedbacksContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const walletAddress = useStore((state) => state.walletAddress);
  const userHasCoWallet = useHasUserConnectedWallet();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const appendTokenId = useStore((state) => state.appendTokenId);
  const mintCost = getMintCost(name);
  const navigation = useAppNavigation();

  const initData = async () => {
    try {
      // If this query fails it means that the token does not exist.
      const token = await signingClient.queryContractSmart(contractAddress, {
        nft_info: {
          token_id: normalizedTokenId(name),
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
      setLoadingFullScreen(false);
      setInitialized(true);
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
    // ---- Setting the name from NSBContext. Redirects to NSBManage if this screen is called when the user owns the token. Redirects to NSBHome if no connected wallet
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    // ===== Controls many things, be careful
    if (!userHasCoWallet || !signingClient) navigation.navigate("NSBHome");
    if (name && userHasCoWallet && isTokenOwned(tokens, name))
      navigation.navigate("NSBManage");

    if (!initialized) {
      setLoadingFullScreen(true);
      initData();
    }
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
      mint: {
        owner: walletAddress,
        token_id: normalizedTokenId(name),
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
        appendTokenId(normalizedTokenId(name));
        console.log(normalizedTokenId(name) + " successfully minted");
        setToastSuccess({
          title: normalizedTokenId(name) + " successfully minted",
          message: "",
        });
        navigation.navigate("NSBConsult", { name });
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
      footerChildren={<BackTo label="Back to search" navItem="NSBRegister" />}
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
    </ScreenContainer>
  );
};
