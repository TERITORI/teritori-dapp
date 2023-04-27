import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import { BrandText } from "../../components/BrandText";
import { CopyToClipboard } from "../../components/CopyToClipboard";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { TNSSendFundsModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { NameData } from "../../components/teritoriNameService/NameData";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import {
  nsPrimaryAliasQueryKey,
  useNSPrimaryAlias,
} from "../../hooks/useNSPrimaryAlias";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getUserId,
  mustGetCosmosNetwork,
} from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17, neutral33 } from "../../utils/style/colors";

const NotOwnerActions: React.FC<{
  tokenId: string;
  ownerId: string;
  isPrimary: boolean;
  onClose: TNSModalCommonProps["onClose"];
}> = ({ isPrimary, ownerId, onClose }) => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const isKeplrConnected = useIsKeplrConnected();
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
          text="Profile"
          style={{ marginRight: 24 }}
          onPress={() => {
            onClose();
            navigation.navigate("UserPublicProfile", { id: ownerId });
          }}
          squaresBackgroundColor={neutral17}
        />
      )}
      <PrimaryButton
        size="XL"
        disabled={!isKeplrConnected}
        text="Send funds"
        // TODO: if no signed, connectKeplr, then, open modal
        onPress={() => setSendFundsModalVisible(true)}
        squaresBackgroundColor={neutral17}
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
  const { selectedWallet: wallet } = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const queryClient = useQueryClient();
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
        <SecondaryButton
          size="M"
          text="Profile"
          style={{ marginRight: 24 }}
          // TODO: if no signed, connectKeplr, then, open modal
          onPress={() => {
            navigation.navigate("UserPublicProfile", { id: ownerId });
          }}
          squaresBackgroundColor={neutral17}
        />
      )}
      <SecondaryButton
        size="M"
        text="Update metadata"
        onPress={() => {
          onClose("TNSUpdateName");
        }}
        squaresBackgroundColor={neutral17}
      />
      <SecondaryButton
        size="M"
        text="Burn"
        style={{ marginLeft: 24 }}
        onPress={() => {
          onClose("TNSBurnName");
        }}
        squaresBackgroundColor={neutral17}
      />
      {!isPrimary && (
        <SecondaryButton
          size="M"
          text="Set as Primary"
          loader
          style={{ marginLeft: 24 }}
          squaresBackgroundColor={neutral17}
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
                network.nameServiceContractAddress
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
              nsPrimaryAliasQueryKey(wallet?.userId)
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
  const { name } = useTNS();
  const { selectedWallet: wallet } = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const tokenId = (name + network?.nameServiceTLD || "").toLowerCase();
  const { nsInfo: token, notFound } = useNSNameInfo(
    networkId,
    tokenId,
    !!network?.nameServiceTLD
  );
  const { nameOwner } = useNSNameOwner(networkId, tokenId);
  const ownerId = getUserId(networkId, nameOwner);
  const isOwnedByUser = ownerId === wallet?.userId;
  const { primaryAlias } = useNSPrimaryAlias(ownerId);
  const isPrimary = primaryAlias === tokenId;

  return (
    <ModalBase
      onClose={() => onClose()}
      onBackPress={() => onClose(navigateBackTo)}
      hideMainSeparator
      label={name}
      width={457}
      contentStyle={{
        backgroundColor: neutral17,
        borderWidth: 1,
        borderColor: neutral33,
      }}
      scrollable
    >
      <View
        style={{
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        {notFound ? (
          <BrandText>Not found</BrandText>
        ) : (
          <>
            <NameNFT style={{ marginBottom: 20, width: "100%" }} name={name} />
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
            {!!token && !!name && (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                {isOwnedByUser ? (
                  <CopyToClipboard
                    text={`https://${window.location.host}/tns/token/${name}`}
                    squaresBackgroundColor={neutral17}
                  />
                ) : (
                  <>
                    {!!token.extension.contract_address && (
                      <CopyToClipboard
                        text={token.extension.contract_address}
                        squaresBackgroundColor={neutral17}
                      />
                    )}
                  </>
                )}
                <NameData token={token} name={name} style={{ marginTop: 20 }} />
              </View>
            )}
          </>
        )}
      </View>
    </ModalBase>
  );
};
