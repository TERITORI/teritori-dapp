import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import longCardSVG from "../../../assets/cards/long-card.svg";
import coinSVG from "../../../assets/icons/coin.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { isTokenOwnedByUser } from "../../utils/tns";
import { defaultMetaData, Metadata } from "../../utils/types/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";
import { TNSRegisterSuccess } from "./TNSRegisterSuccess";

const CostContainer: React.FC = () => {
  const width = 417;
  const height = 80;

  return (
    <View>
      <SVG
        width={width}
        height={height}
        source={longCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          height,
          width,
          minHeight: height,
          minWidth: width,
        }}
      >
        <SVG
          width={32}
          height={32}
          source={coinSVG}
          style={{
            marginLeft: 24,
            marginRight: 12,
          }}
        />

        <BrandText style={[fontSemibold14]}>
          The mint cost for this token is 1,000 Tori
        </BrandText>
      </View>
    </View>
  );
};

interface TNSMintNameScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintNameScreen: React.FC<TNSMintNameScreenProps> = ({
  onClose,
  navigateBackTo,
}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const { name } = useTNS();
  const { setLoadingFullScreen, setToastError, setToastSuccess } =
    useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const contractAddress = process.env
    .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
  const mintCost = getMintCost(name);
  const navigation = useAppNavigation();

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
        user_header_image: token.extension.user_header_image,
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
      setInitialized(true);
      setLoadingFullScreen(false);
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
    // ===== Controls many things, be careful
    if (!userHasCoWallet || !isKeplrConnected) navigation.navigate("TNSHome");
    if (name && userHasCoWallet && isTokenOwnedByUser(tokens, name)) onClose();

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
      image, // TODO - support later
      user_header_image,
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

    try {
      const walletAddress = (await getFirstKeplrAccount()).address;

      const msg = {
        mint: {
          owner: walletAddress,
          token_id: normalizedTokenId,
          token_uri: null, // TODO - support later
          extension: {
            image,
            user_header_image,
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

      const signingClient = await getSigningCosmWasmClient();

      const mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo,
        mintCost
      );
      if (mintedToken) {
        console.log(normalizedTokenId + " successfully minted");
        setToastSuccess({
          title: normalizedTokenId + " successfully minted",
          message: "",
        });

        setSuccessModal(true);
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

  const handleModalClose = () => {
    onClose();
    setSuccessModal(false);
  };

  return (
    <ModalBase
      onClose={onClose}
      onBackPress={() => onClose(navigateBackTo)}
      width={480}
      scrollable
      label={name}
      hideMainSeparator
      contentStyle={{
        backgroundColor: neutral17,
      }}
    >
      <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
        <CostContainer />
        <NameNFT
          style={{
            backgroundColor: neutral00,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 8,
            paddingBottom: 48,
            width: "100%",
          }}
          name={name}
        />
        <NameDataForm
          btnLabel="Register your username"
          onPressBtn={submitData}
          initialData={initialData}
        />
      </View>
      <TNSRegisterSuccess visible={isSuccessModal} onClose={handleModalClose} />
    </ModalBase>
  );
};
