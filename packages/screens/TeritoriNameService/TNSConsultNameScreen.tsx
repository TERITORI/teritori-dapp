import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";

import ModalBase from "../../components/modals/ModalBase";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { TNSSendFundsModal } from "@/components/modals/teritoriNameService/TNSSendFundsModal";
import { NameNFT } from "@/components/teritoriNameService/NameNFT";
import { TNSModalCommonProps } from "@/components/user/types";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useTNS } from "@/context/TNSProvider";
import { TeritoriNameServiceClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useDAOs } from "@/hooks/dao/useDAOs";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsKeplrConnected } from "@/hooks/useIsKeplrConnected";
import { useIsLeapConnected } from "@/hooks/useIsLeapConnected";
import { useNSNameInfo } from "@/hooks/useNSNameInfo";
import { useNSNameOwner } from "@/hooks/useNSNameOwner";
import {
  nsPrimaryAliasQueryKey,
  useNSPrimaryAlias,
} from "@/hooks/useNSPrimaryAlias";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getCosmosNetwork, getUserId, mustGetCosmosNetwork } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { neutral17, neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

const NotOwnerActions: React.FC<{
  tokenId: string;
  ownerId: string;
  isPrimary: boolean;
  onClose: TNSModalCommonProps["onClose"];
}> = ({ isPrimary, ownerId, onClose }) => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const isKeplrConnected = useIsKeplrConnected();
  const isLeapConnected = useIsLeapConnected();

  const navigation = useAppNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 42,
        alignSelf: "center",
      }}
    >
      {isPrimary && (
        <PrimaryButton
          size="XL"
          text="View Profile"
          boxStyle={{ marginRight: layout.spacing_x3 }}
          onPress={() => {
            onClose();
            navigation.navigate("UserPublicProfile", { id: ownerId });
          }}
        />
      )}
      <PrimaryButton
        size="XL"
        disabled={!isKeplrConnected && !isLeapConnected}
        text="Send Funds"
        // TODO: if no signed, connectKeplr, then, open modal
        onPress={() => setSendFundsModalVisible(true)}
      />
      <TNSSendFundsModal
        onClose={() => setSendFundsModalVisible(false)}
        isVisible={sendFundsModalVisible}
      />
    </View>
  );
};

const OwnerActions: React.FC<{
  onClose: TNSModalCommonProps["onClose"];
  tokenId: string;
  ownerId: string;
  isPrimary: boolean;
}> = ({ onClose, isPrimary, tokenId, ownerId }) => {
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const queryClient = useQueryClient();
  const navigation = useAppNavigation();
  return (
    <View
      style={{
        flexDirection: Platform.OS === "web" ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: layout.spacing_x3,
        alignSelf: "center",
        gap: Platform.OS === "web" ? 0 : 20,
      }}
    >
      {isPrimary && (
        <SecondaryButton
          size="M"
          text="View Profile"
          style={{ marginRight: Platform.OS === "web" ? layout.spacing_x3 : 0 }}
          onPress={() => {
            onClose();
            navigation.navigate("UserPublicProfile", { id: ownerId });
          }}
        />
      )}
      <SecondaryButton
        size="M"
        text="Update"
        onPress={() => {
          onClose("TNSUpdateName");
        }}
      />
      <SecondaryButton
        size="M"
        text="Burn"
        style={{ marginLeft: Platform.OS === "web" ? layout.spacing_x3 : 0 }}
        onPress={() => {
          onClose("TNSBurnName");
        }}
      />
      {!isPrimary && (
        <SecondaryButton
          size="M"
          text="Set as Primary"
          loader
          style={{ marginLeft: layout.spacing_x3 }}
          onPress={async () => {
            try {
              const network = mustGetCosmosNetwork(wallet?.networkId);
              if (
                !network.nameServiceContractAddress ||
                !network.nameServiceTLD
              ) {
                throw new Error("network not supported");
              }
              const client = new TeritoriNameServiceClient(
                await getKeplrSigningCosmWasmClient(network.id),
                wallet?.address || "",
                network.nameServiceContractAddress,
              );
              await client.updatePrimaryAlias({
                tokenId,
              });
              setToastSuccess({ title: "Success", message: "Set as primary" });
            } catch (err) {
              console.error(err);
              if (err instanceof Error) {
                setToastError({
                  title: "Failed to set as primary",
                  message: err.message,
                });
              }
            }
            await queryClient.invalidateQueries(
              nsPrimaryAliasQueryKey(wallet?.userId),
            );
          }}
        />
      )}
    </View>
  );
};

interface TNSConsultNameProps extends TNSModalCommonProps {}
export const TNSConsultNameScreen: React.FC<TNSConsultNameProps> = ({
  onClose,
  navigateBackTo,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const { name } = useTNS();
  const wallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const tokenId = (name + network?.nameServiceTLD || "").toLowerCase();
  const { notFound } = useNSNameInfo(
    networkId,
    tokenId,
    !!network?.nameServiceTLD,
  );

  const { nameOwner } = useNSNameOwner(networkId, tokenId);
  const ownerId = getUserId(networkId, nameOwner);
  const { daos } = useDAOs({ networkId, memberAddress: wallet?.address });

  const isOwnedByUser = useMemo(
    () =>
      ownerId === wallet?.userId || !!daos?.find((dao) => dao.id === ownerId),
    [daos, ownerId, wallet?.userId],
  );

  const { primaryAlias } = useNSPrimaryAlias(ownerId);
  const isPrimary = primaryAlias === tokenId;
  const width = windowWidth < 457 ? windowWidth : 457;

  return (
    <ModalBase
      onClose={() => onClose()}
      onBackPress={() => onClose(navigateBackTo)}
      hideMainSeparator
      label={name}
      width={width}
      boxStyle={{
        backgroundColor: neutral17,
        borderWidth: 1,
        borderColor: neutral33,
      }}
      scrollable
    >
      <View
        style={{
          justifyContent: "center",
        }}
      >
        {notFound ? (
          <BrandText>Not found</BrandText>
        ) : (
          <>
            <NameNFT
              style={{ marginBottom: layout.spacing_x3, width: "100%" }}
              name={name}
            />

            {!notFound &&
              (isOwnedByUser ? (
                <OwnerActions
                  tokenId={tokenId}
                  ownerId={ownerId}
                  isPrimary={isPrimary}
                  onClose={onClose}
                />
              ) : (
                <NotOwnerActions
                  tokenId={tokenId}
                  ownerId={ownerId}
                  isPrimary={isPrimary}
                  onClose={onClose}
                />
              ))}
          </>
        )}
      </View>
    </ModalBase>
  );
};
