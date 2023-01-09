import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { getNetwork } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { defaultMintFee } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17 } from "../../utils/style/colors";
import { isTokenOwnedByUser, tokenWithoutTld } from "../../utils/tns";
import { defaultMetaData } from "../../utils/types/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

const normalize = (inputString: string) => {
  const invalidChrsRemoved = inputString.replace(/[^a-z0-9\-_]/g, "");
  return invalidChrsRemoved.replace(/[_-]{2,}/g, "");
};

interface TNSMintPathScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintPathScreen: React.FC<TNSMintPathScreenProps> = ({
  onClose,
  navigateBackTo,
}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const { name, setName } = useTNS();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { tokens } = useTokenList();
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const contractAddress = process.env
    .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;

  const normalizedTokenId = (name + process.env.TLD).toLowerCase();

  const initData = async () => {
    try {
      const cosmwasmClient = await getNonSigningCosmWasmClient(selectedNetwork);

      const client = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        contractAddress
      );

      // If this query fails it means that the token does not exist.
      const { extension } = await client.nftInfo({
        tokenId: normalizedTokenId,
      });
      setInitialized(true);
      setInitialData(extension);
    } catch {
      setInitialized(true);
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // ==== Init
  useFocusEffect(() => {
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
      initData();
    }
  });

  // FIXME: typesafe data
  const submitData = async (data: any) => {
    if (!isKeplrConnected) {
      return;
    }
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
      const walletAddress = (await getFirstKeplrAccount(selectedNetwork))
        .address;

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

      const signingClient = await getSigningCosmWasmClient(selectedNetwork);

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
        setName(tokenWithoutTld(pathId));
        onClose("TNSConsultName");
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
    }
  };

  return (
    <ModalBase
      onClose={() => onClose()}
      onBackPress={() => onClose(navigateBackTo)}
      width={480}
      scrollable
      label={name}
      hideMainSeparator
      contentStyle={{
        backgroundColor: neutral17,
      }}
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
    </ModalBase>
  );
};
