import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
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
import { neutral17 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { defaultMetaData, Metadata } from "../../utils/types/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

interface TNSUpdateNameScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSUpdateNameScreen: React.FC<TNSUpdateNameScreenProps> = ({
                                                                          onClose,
                                                                        }) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } = useTNS();
  const { setLoadingFullScreen, setToastSuccess, setToastError } =
    useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const contractAddress = process.env
    .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;

  const initData = async () => {
    try {
      const signingClient = await getSigningCosmWasmClient();

      // If this query fails it means that the token does not exist.
      const token = await signingClient.queryContractSmart(contractAddress, {
        nft_info: {
          token_id: name + process.env.TLD,
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
      setInitialized(true);
      setInitialData(tokenData);
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
    if (!initialized) initData();
  });

  // FIXME: typesafe data
  const submitData = async (data: any) => {
    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    if (
      tokens.length &&
      (!userHasCoWallet || !isTokenOwnedByUser(tokens, name))
    ) {
      setToastError({
        title: "Something went wrong!",
        message: "",
      });
      return;
    }

    setLoadingFullScreen(true);
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
    } = data;

    const normalizedTokenId = (name + process.env.TLD).toLowerCase();

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
      const walletAddress = (await getFirstKeplrAccount()).address;

      const signingClient = await getSigningCosmWasmClient();

      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedTokenId + " successfully updated",
          message: "",
        });
        setName(name);
        onClose("TNSConsultName");
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
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      scrollable
      width={457}
      contentStyle={{
        backgroundColor: neutral17,
      }}
    >
      <NameNFT name={name} />
      <View
        style={{
          marginVertical: 20,
        }}
      >
        <NameDataForm
          btnLabel="Update profile"
          onPressBtn={submitData}
          initialData={initialData}
        />
      </View>
    </ModalBase>
  );
};
