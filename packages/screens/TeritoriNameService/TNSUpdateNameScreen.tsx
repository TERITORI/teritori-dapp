import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { nsNameInfoQueryKey } from "../../hooks/name-service/useNSNameInfo";
import { useNSTokensByOwner } from "../../hooks/name-service/useNSTokensByOwner";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useWalletTNSClient } from "../../hooks/wallets/useWalletClients";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getCosmosNetwork,
} from "../../networks";
import { neutral17 } from "../../utils/style/colors";
import { defaultMetaData } from "../../utils/types/tns";

interface TNSUpdateNameScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSUpdateNameScreen: React.FC<TNSUpdateNameScreenProps> = ({
  onClose,
}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } = useTNS();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const network = getCosmosNetwork(selectedWallet?.networkId);
  const walletAddress = selectedWallet?.address;
  const normalizedTokenId = (
    name + network?.nameServiceTLD || ""
  ).toLowerCase();
  const getNSClient = useWalletTNSClient(selectedWallet?.id);

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
        tokenId: name + network.nameServiceTLD || "",
      });
      console.log("in data", extension);
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
    if (!initialized) initData();
  });

  const queryClient = useQueryClient();

  const submitData = async (data: Metadata) => {
    console.log("data", data);
    if (!walletAddress) {
      setToastError({
        title: "No wallet address",
        message: "",
      });
      return;
    }
    if (tokens.length && !tokens.includes(normalizedTokenId)) {
      setToastError({
        title: "Something went wrong!",
        message: "",
      });
      return;
    }

    try {
      const nsClient = await getNSClient();
      const updatedToken = await nsClient.updateMetadata({
        tokenId: normalizedTokenId,
        metadata: data,
      });

      if (updatedToken) {
        console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedTokenId + " successfully updated",
          message: "",
        });
        setName(name);
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
    await queryClient.invalidateQueries(
      nsNameInfoQueryKey(selectedWallet?.networkId, normalizedTokenId)
    );
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
