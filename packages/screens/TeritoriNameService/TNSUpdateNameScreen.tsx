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
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { nsNameInfoQueryKey } from "../../hooks/useNSNameInfo";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
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
  const { daos } = useDAOs({
    networkId: selectedWallet?.networkId,
    memberAddress: selectedWallet?.address,
  });
  const { nameOwner } = useNSNameOwner(
    selectedWallet?.networkId,
    network?.nameServiceTLD ? name + network.nameServiceTLD : "",
  );
  const ownerDAO = daos?.find((dao) => dao.contractAddress === nameOwner);
  const makeProposal = useDAOMakeProposal(ownerDAO?.id);

  const initData = async () => {
    try {
      const network = mustGetCosmosNetwork(selectedWallet?.networkId);
      if (!network.nameServiceContractAddress) {
        throw new Error("network not supported");
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

      const client = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        network.nameServiceContractAddress,
      );

      // If this query fails it means that the token does not exist.
      const { extension } = await client.nftInfo({
        tokenId: name + network.nameServiceTLD || "",
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
    if (!initialized) initData();
  });

  const queryClient = useQueryClient();

  const submitData = async (data: Metadata) => {
    if (!walletAddress) {
      setToastError({
        title: "No wallet address",
        message: "",
      });
      console.error("no wallet address");
      return;
    }

    const msg = {
      update_metadata: {
        token_id: normalizedTokenId,
        metadata: data,
      },
    };

    try {
      if (ownerDAO) {
        const networkId = selectedWallet?.networkId;
        if (!networkId) {
          throw new Error("no network id");
        }

        if (!network?.nameServiceContractAddress) {
          throw new Error("network not supported");
        }

        if (!selectedWallet?.address) {
          throw new Error("no wallet address");
        }
        const res = await makeProposal(selectedWallet.address, {
          title: `Update ${msg.update_metadata.token_id}`,
          description: "",
          msgs: [
            {
              wasm: {
                execute: {
                  contract_addr: network.nameServiceContractAddress,
                  msg: Buffer.from(JSON.stringify(msg)).toString("base64"),
                  funds: [],
                },
              },
            },
          ],
        });
        console.log("created proposal", res);
        setToastSuccess({
          title: "Created proposal",
          message: "",
        });
        setName(name);
        onClose("TNSConsultName");
      } else {
        if (tokens.length && !tokens.includes(normalizedTokenId)) {
          setToastError({
            title: "Something went wrong!",
            message: "",
          });
          console.error("something went wrong");
          return;
        }

        const network = mustGetCosmosNetwork(selectedWallet?.networkId);
        if (!network.nameServiceContractAddress) {
          throw new Error("network not supported");
        }

        const signingClient = await getKeplrSigningCosmWasmClient(network.id);

        const updatedToken = await signingClient.execute(
          walletAddress,
          network.nameServiceContractAddress,
          msg,
          "auto",
        );
        if (updatedToken) {
          console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
          setToastSuccess({
            title: normalizedTokenId + " successfully updated",
            message: "",
          });
          setName(name);
          onClose("TNSConsultName");
        }
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
      nsNameInfoQueryKey(selectedWallet?.networkId, normalizedTokenId),
    );
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      scrollable
      width={457}
      boxStyle={{
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
          btnLabel={ownerDAO ? "Propose update" : "Update profile"}
          onPressBtn={submitData}
          initialData={initialData}
        />
      </View>
    </ModalBase>
  );
};
