import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getCosmosNetwork,
} from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17 } from "../../utils/style/colors";
import { nsTokenWithoutTLD } from "../../utils/tns";
import { defaultMetaData } from "../../utils/types/tns";

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
  const { name, setName } = useTNS();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const network = getCosmosNetwork(selectedWallet?.networkId);
  const walletAddress = selectedWallet?.address;

  const normalizedTokenId = (
    name + network?.nameServiceTLD || ""
  ).toLowerCase();

  const initData = async () => {
    try {
      const network = mustGetCosmosNetwork(selectedWallet?.networkId);
      if (!network.nameServiceContractAddress) {
        throw new Error("network not supported");
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

      const client = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        network.nameServiceContractAddress
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
    if (name && tokens.length && !tokens.includes(normalizedTokenId)) {
      navigation.navigate("TNSHome");
    }
    if (!initialized) {
      initData();
    }
  });

  // FIXME: typesafe data
  const submitData = async (data: any) => {
    if (!walletAddress) {
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
      const network = mustGetCosmosNetwork(selectedWallet?.networkId);
      if (!network.nameServiceContractAddress) {
        throw new Error("network not supported");
      }

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

      const signingClient = await getKeplrSigningCosmWasmClient(network.id);

      const mintedToken = await signingClient.execute(
        walletAddress,
        network.nameServiceContractAddress,
        msg,
        "auto"
      );
      if (mintedToken) {
        console.log(normalizedPathId + " successfully minted"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedPathId + " successfully minted",
          message: "",
        });
        setName(nsTokenWithoutTLD(pathId));
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
