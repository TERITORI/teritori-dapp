import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import longCardSVG from "../../../assets/cards/long-card.svg";
import coinSVG from "../../../assets/icons/coin.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { getMultisigAccount } from "../../hooks/multisig";
import { useCreateMultisigTransactionForExecuteContract } from "../../hooks/multisig/useCreateMultisigTransactionForExecuteContract";
import { useBalances } from "../../hooks/useBalances";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getCosmosNetwork,
  getUserId,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { defaultMetaData } from "../../utils/types/tns";
import { CheckLoadingModal } from "../Multisig/components/CheckLoadingModal";
import { MultisigTransactionType } from "../Multisig/types";

const CostContainer: React.FC<{ price: { amount: string; denom: string } }> = ({
  price,
}) => {
  const networkId = useSelectedNetworkId();

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
          The mint cost for this token is{" "}
          {prettyPrice(networkId, price.amount, price.denom)}
        </BrandText>
      </View>
    </View>
  );
};

interface TNSMintNameMultisignScreenProps extends TNSModalCommonProps {
  address: string;
}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintNameMultisignScreen: React.FC<
  TNSMintNameMultisignScreenProps
> = ({ onClose, navigateBackTo, address }) => {
  const { isLoading, mutate } =
    useCreateMultisigTransactionForExecuteContract();

  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name } = useTNS();
  const networkId = useSelectedNetworkId();
  const { tokens } = useNSTokensByOwner(getUserId(networkId, address));
  const network = getCosmosNetwork(networkId);
  const normalizedTokenId = (
    name + network?.nameServiceTLD || ""
  ).toLowerCase();
  const price = useTNSMintPrice(networkId, normalizedTokenId);
  const balances = useBalances(networkId, address);
  const balance = balances.find((bal) => bal.denom === price?.denom);

  const initData = async () => {
    try {
      const network = mustGetCosmosNetwork(networkId);

      if (!network.nameServiceContractAddress) {
        return;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        networkId || ""
      );

      const client = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        network.nameServiceContractAddress
      );

      // If this query fails it means that the token does not exist.
      const { extension } = await client.nftInfo({
        tokenId: normalizedTokenId,
      });
      setInitialData(extension);
      setInitialized(true);
    } catch {
      setInitialized(true);
    }
  };

  // ==== Init
  useFocusEffect(() => {
    // ===== Controls many things, be careful
    if (name && tokens.includes(normalizedTokenId)) onClose();

    if (!initialized) {
      initData();
    }
  });

  const submitData = async (data: Metadata) => {
    if (!price) {
      return;
    }

    try {
      const network = mustGetCosmosNetwork(networkId);
      if (!network.nameServiceContractAddress) {
        throw new Error("network not supported");
      }

      const walletAddress = address;

      const msg = {
        mint: {
          owner: walletAddress,
          token_id: normalizedTokenId,
          extension: data,
        },
      };
      const mltisignAccountInfo = await getMultisigAccount(address, networkId);
      if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
        mutate({
          formData: {
            contractAddress: network.nameServiceContractAddress,
            multisigAddress: walletAddress,
            msg,
            multisigId: mltisignAccountInfo.dbData._id,
            type: MultisigTransactionType.REGISTER_TNS,
          },
          accountOnChain: mltisignAccountInfo?.accountData,
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
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
      <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
        {!!price && <CostContainer price={price} />}
        <BrandText
          style={{
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          Available Balance:{" "}
          {prettyPrice(
            network?.id || "",
            balance?.amount || "0",
            price?.denom || ""
          )}
        </BrandText>
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
          disabled={
            !price ||
            parseInt(balance?.amount || "0", 10) < parseInt(price.amount, 10)
          }
        />
      </View>
      <CheckLoadingModal isVisible={isLoading} />
    </ModalBase>
  );
};

const useTNSMintPrice = (networkId: string | undefined, tokenId: string) => {
  const { data } = useQuery(
    ["tnsMintPrice", networkId, tokenId],
    async () => {
      if (!networkId) {
        return null;
      }
      const network = mustGetCosmosNetwork(networkId);
      if (!network.nameServiceContractAddress) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(networkId);

      const tnsClient = new TeritoriNameServiceQueryClient(
        client,
        network.nameServiceContractAddress
      );

      const info = await tnsClient.contractInfo();

      const amount = await tnsClient.mintPrice({ tokenId });

      return { denom: info.native_denom, amount: amount?.toString() || "0" };
    },
    { staleTime: Infinity }
  );
  return data;
};
