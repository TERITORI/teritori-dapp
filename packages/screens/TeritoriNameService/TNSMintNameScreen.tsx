import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import { TNSRegisterSuccess } from "./TNSRegisterSuccess";
import longCardSVG from "../../../assets/cards/long-card.svg";
import coinSVG from "../../../assets/icons/coin.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/teritoriNameService/NameDataForm";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { nsNameInfoQueryKey } from "../../hooks/name-service/useNSNameInfo";
import { useNSTokensByOwner } from "../../hooks/name-service/useNSTokensByOwner";
import { useTNSMintPrice } from "../../hooks/name-service/useTNSMintPrice";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useWalletTNSClient } from "../../hooks/wallets/useWalletClients";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getCosmosNetwork,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { defaultMetaData } from "../../utils/types/tns";

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

interface TNSMintNameScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSMintNameScreen: React.FC<TNSMintNameScreenProps> = ({
  onClose,
  navigateBackTo,
}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const selectedWallet = useSelectedWallet();
  const { name } = useTNS();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const isWalletConnected = !!selectedWallet;
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const normalizedTokenId = (
    name + network?.nameServiceTLD || ""
  ).toLowerCase();
  const price = useTNSMintPrice(networkId, normalizedTokenId);
  const balances = useBalances(networkId, selectedWallet?.address);
  const balance = balances.find((bal) => bal.denom === price?.denom);
  const getClient = useWalletTNSClient(selectedWallet?.id);

  const initData = async () => {
    try {
      const network = mustGetCosmosNetwork(selectedWallet?.networkId);

      if (!network.nameServiceContractAddress) {
        return;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        selectedWallet?.networkId || ""
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
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // ==== Init
  useFocusEffect(() => {
    // ===== Controls many things, be careful
    if (!isWalletConnected) navigation.navigate("TNSHome");
    if (name && isWalletConnected && tokens.includes(normalizedTokenId))
      onClose();

    if (!initialized) {
      initData();
    }
  });

  const queryClient = useQueryClient();

  const submitData = async (data: Metadata) => {
    if (!isWalletConnected || !price) {
      return;
    }

    try {
      const walletAddress = selectedWallet?.address;

      if (!walletAddress) {
        throw new Error("bad wallet");
      }

      const client = await getClient();
      const mintedToken = await client.mint(
        {
          owner: walletAddress,
          tokenId: normalizedTokenId,
          extension: data,
        },
        "auto",
        undefined,
        [price]
      );

      if (mintedToken) {
        console.log(normalizedTokenId + " successfully minted");
        setToastSuccess({
          title: normalizedTokenId + " successfully minted",
          message: "",
        });

        setSuccessModal(true);
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

  const handleModalClose = () => {
    onClose();
    setSuccessModal(false);
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
      <TNSRegisterSuccess visible={isSuccessModal} onClose={handleModalClose} />
    </ModalBase>
  );
};
