import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { CopyToClipboard } from "../../components/CopyToClipboard";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SendFundModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { BackTo } from "../../components/navigation/BackTo";
import { NameData } from "../../components/teritoriNameService/NameData";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useToken, useTokenList } from "../../hooks/tokens";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { isTokenOwnedByUser } from "../../utils/tns";

const NotOwnerActions = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const isKeplrConnected = useIsKeplrConnected();
  return (
    <>
      {/*TODO: Fix: goBack() fails sometimes*/}
      <BackTo label="Back" />
      <PrimaryButton
        size="XL"
        disabled={!isKeplrConnected}
        text="Send funds"
        style={{ marginLeft: 24 }}
        // TODO: if no signed, connectKeplr, then, open modal
        onPress={() => setSendFundsModalVisible(true)}
      />
      <SendFundModal
        onClose={() => setSendFundsModalVisible(false)}
        visible={sendFundsModalVisible}
      />
    </>
  );
};

const OwnerActions = () => {
  const navigation = useAppNavigation();
  const { name } = useTNS();
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  return (
    <>
      <BackTo label="Back" />
      <SecondaryButton
        size="M"
        text="Update metadata"
        style={{ marginLeft: 24 }}
        onPress={() => navigation.navigate("TNSUpdateName", { name })}
      />
      <SecondaryButton
        size="M"
        text="Burn"
        style={{ marginLeft: 24 }}
        onPress={() => navigation.navigate("TNSBurnName", { name })}
      />
      <SecondaryButton
        size="M"
        text="Set as Primary"
        style={{ marginLeft: 24 }}
        onPress={async () => {
          try {
            const client = new TeritoriNameServiceClient(
              await getSigningCosmWasmClient(),
              wallet?.address || "",
              process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS || ""
            );
            await client.updatePrimaryAlias({
              tokenId: `${name}.tori`,
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
        }}
      />
    </>
  );
};

export const TNSConsultNameScreen: ScreenFC<"TNSConsultName"> = ({ route }) => {
  const { name, setName } = useTNS();
  const { setLoadingFullScreen } = useFeedbacks();
  const { token, notFound, loadingToken } = useToken(
    name,
    process.env.TLD || ""
  );
  const { tokens, loadingTokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const navigation = useAppNavigation();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingToken);
  }, [loadingToken]);
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  // ---- Setting the name from TNSContext. Redirects to TNSHome if this screen is called when the token is not minted
  useFocusEffect(() => {
    setName(route.params.name);
    if (!isKeplrConnected) navigation.navigate("TNSHome");
  });

  return (
    <ScreenContainer
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
      footerChildren={
        isTokenOwnedByUser(tokens, name) && !notFound ? (
          <OwnerActions />
        ) : !notFound ? (
          <NotOwnerActions />
        ) : (
          <BackTo
            label="Back to home"
            onPress={() => navigation.navigate("TNSHome")}
          />
        )
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        {notFound ? (
          <BrandText>Not found</BrandText>
        ) : (
          <>
            <View
              style={{ flex: 1, marginRight: 20, width: "100%", maxWidth: 332 }}
            >
              <NameNFT style={{ marginBottom: 20 }} name={name} />
              {token && name && isTokenOwnedByUser(tokens, name) ? (
                <CopyToClipboard
                  text={`https://${window.location.host}/tns/token/${name}`}
                />
              ) : token && name && !isTokenOwnedByUser(tokens, name) ? (
                <CopyToClipboard text={token.contract_address} />
              ) : null}
            </View>

            <NameData token={token} name={name} />
          </>
        )}
      </View>
    </ScreenContainer>
  );
};
