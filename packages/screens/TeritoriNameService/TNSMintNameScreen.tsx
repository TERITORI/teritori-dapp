import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import React, { useMemo, useState } from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";

import { TNSRegisterSuccess } from "./TNSRegisterSuccess";
import longCardSVG from "../../../assets/cards/long-card.svg";
import coinSVG from "../../../assets/icons/coin.svg";
import ModalBase from "../../components/modals/ModalBase";
import {
  ExecuteMsg as TNSExecuteMsg,
  Metadata,
} from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { Coin } from "@/api/teritori-chain/cosmos/base/v1beta1/coin";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { NameDataForm } from "@/components/teritoriNameService/NameDataForm";
import { NameNFT } from "@/components/teritoriNameService/NameNFT";
import { TNSModalCommonProps } from "@/components/user/types";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useTNS } from "@/context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useAreThereWallets } from "@/hooks/useAreThereWallets";
import { useBalances } from "@/hooks/useBalances";
import { useCanPay } from "@/hooks/useCanPay";
import { useIsKeplrConnected } from "@/hooks/useIsKeplrConnected";
import { useIsLeapConnected } from "@/hooks/useIsLeapConnected";
import { useNSMintPrice } from "@/hooks/useNSMintPrice";
import { nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import { useNSTokensByOwner } from "@/hooks/useNSTokensByOwner";
import { useRunOrProposeTransaction } from "@/hooks/useRunOrProposeTransaction";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  getCosmosNetwork,
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
  UserKind,
} from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { neutral00, neutral17, neutral33 } from "@/utils/style/colors";
import { fontRegular14 } from "@/utils/style/fonts";
import { defaultMetaData } from "@/utils/types/tns";

const CostContainer: React.FC<{ price: { amount: string; denom: string } }> = ({
  price,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const width =
    windowWidth < 417
      ? windowWidth - 40
      : Platform.OS === "web"
        ? 417
        : 417 - 40;
  const height = 80;

  const networkId = useSelectedNetworkId();

  return (
    <View style={{ alignSelf: "center" }}>
      <SVG
        width={width}
        height={height}
        source={longCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
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

        <BrandText style={[fontRegular14]}>
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
  const selectedWallet = useSelectedWallet();
  const { name } = useTNS();
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const isKeplrConnected = useIsKeplrConnected();
  const isLeapConnected = useIsLeapConnected();

  const userHasCoWallet = useAreThereWallets();
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const normalizedTokenId = (
    name + network?.nameServiceTLD || ""
  ).toLowerCase();

  const initData = async () => {
    try {
      const network = mustGetCosmosNetwork(selectedWallet?.networkId);

      if (!network.nameServiceContractAddress) {
        return;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        selectedWallet?.networkId || "",
      );

      const client = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        network.nameServiceContractAddress,
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
    if (!userHasCoWallet || (!isKeplrConnected && !isLeapConnected))
      navigation.navigate("TNSHome");
    if (name && userHasCoWallet && tokens.includes(normalizedTokenId))
      onClose();

    if (!initialized) {
      initData();
    }
  });

  return (
    <TNSMintNameModal
      initialData={initialData}
      userId={selectedWallet?.userId}
      userKind={UserKind.Single}
      onClose={onClose}
      navigateBackTo={navigateBackTo}
    />
  );
};

export const TNSMintNameModal: React.FC<
  TNSModalCommonProps & {
    initialData: Metadata;
    userId: string | undefined;
    userKind: UserKind;
  }
> = ({ onClose, initialData, userId, userKind, navigateBackTo }) => {
  const { width: windowWidth } = useWindowDimensions();

  const [network, userAddress] = parseUserId(userId);
  const networkId = network?.id;
  const cosmosNetwork = getCosmosNetwork(networkId);
  const { name } = useTNS();
  const normalizedTokenId = (
    name + cosmosNetwork?.nameServiceTLD || ""
  ).toLowerCase();
  const [isSuccessModal, setSuccessModal] = useState(false);
  const { balances } = useBalances(networkId, userAddress);
  const isKeplrConnected = useIsKeplrConnected();
  const isLeapConnected = useIsLeapConnected();

  const { setToastError, setToastSuccess } = useFeedbacks();
  const { nsMintPrice: price } = useNSMintPrice(networkId, normalizedTokenId);
  const balance = balances.find((bal) => bal.denom === price?.denom);
  const cost: Coin = useMemo(() => {
    return {
      amount: price?.amount || "0",
      denom: price?.denom || "",
    };
  }, [price?.amount, price?.denom]);
  const canPayForMintName = useCanPay({ userId, cost });
  const runOrProposeTransaction = useRunOrProposeTransaction(userId, userKind);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: Metadata) => {
    if ((!isKeplrConnected && !isLeapConnected) || !price) {
      // FIXME: define some central "areCosmosWalletsConnected"
      return;
    }

    try {
      if (!cosmosNetwork?.nameServiceContractAddress) {
        throw new Error("Invalid network");
      }
      if (!price) {
        throw new Error("Invalid price");
      }

      const payload: TNSExecuteMsg = {
        mint: {
          owner: userAddress,
          token_id: normalizedTokenId,
          extension: data,
        },
      };

      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: userAddress,
          contract: cosmosNetwork.nameServiceContractAddress,
          msg: toUtf8(JSON.stringify(payload)),
          funds: Long.fromString(price.amount).isZero() ? undefined : [price],
        },
      };

      await runOrProposeTransaction({ msgs: [msg], navigateToProposals: true });

      const toastTitle =
        userKind === UserKind.Single
          ? normalizedTokenId + " successfully booked"
          : "Proposed to book " + normalizedTokenId;
      setToastSuccess({
        title: toastTitle,
        message: "",
      });
      if (userKind === UserKind.Single) {
        setSuccessModal(true);
      } else {
        onClose?.();
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
      nsNameInfoQueryKey(networkId, normalizedTokenId),
    );
  };

  const handleModalClose = () => {
    onClose();
    setSuccessModal(false);
  };
  const width = windowWidth < 480 ? windowWidth : 480;

  return (
    <ModalBase
      onClose={() => onClose()}
      onBackPress={() => onClose(navigateBackTo)}
      width={width}
      scrollable
      label={name}
      hideMainSeparator
      boxStyle={{
        backgroundColor: neutral17,
        paddingBottom: 80,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        {!!price && <CostContainer price={price} />}
        <BrandText style={[fontRegular14, { marginBottom: 16 }]}>
          Available Balance:{" "}
          {prettyPrice(
            network?.id || "",
            balance?.amount || "0",
            price?.denom || "",
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
          btnLabel={
            !canPayForMintName
              ? "Not enough funds"
              : userKind === UserKind.Single
                ? "Register your username"
                : "Propose to register"
          }
          onPressBtn={handleSubmit}
          initialData={initialData}
          disabled={!canPayForMintName}
        />
      </ScrollView>
      <TNSRegisterSuccess visible={isSuccessModal} onClose={handleModalClose} />
    </ModalBase>
  );
};
