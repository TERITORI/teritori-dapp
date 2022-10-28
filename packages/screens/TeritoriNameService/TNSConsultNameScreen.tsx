import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { CopyToClipboard } from "../../components/CopyToClipboard";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { SendFundModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { NameData } from "../../components/teritoriNameService/NameData";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useToken, useTokenList } from "../../hooks/tokens";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { neutral17, neutral33 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

const NotOwnerActions: React.FC = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const isKeplrConnected = useIsKeplrConnected();
  return (
    <>
      <PrimaryButton
        size="XL"
        disabled={!isKeplrConnected}
        text="Send funds"
        style={{ marginBottom: 42, alignSelf: "center" }}
        // TODO: if no signed, connectKeplr, then, open modal
        onPress={() => setSendFundsModalVisible(true)}
        squaresBackgroundColor={neutral17}
      />
      <SendFundModal
        onClose={() => setSendFundsModalVisible(false)}
        visible={sendFundsModalVisible}
      />
    </>
  );
};

const OwnerActions = ({
                        onClose,
                      }: {
  onClose: TNSModalCommonProps["onClose"];
}) => {
  const { name, setName } = useTNS();
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 42,
        alignSelf: "center",
      }}
    >
      <SecondaryButton
        size="M"
        text="Update metadata"
        onPress={() => {
          setName(name);
          onClose("TNSUpdateName");
        }}
        squaresBackgroundColor={neutral17}
      />
      <SecondaryButton
        size="M"
        text="Burn"
        style={{ marginLeft: 24 }}
        onPress={() => {
          setName(name);
          onClose("TNSBurnName");
        }}
        squaresBackgroundColor={neutral17}
      />
      <SecondaryButton
        size="M"
        text="Set as Primary"
        style={{ marginLeft: 24 }}
        squaresBackgroundColor={neutral17}
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
    </View>
  );
};

interface TNSConsultNameProps extends TNSModalCommonProps {}
export const TNSConsultNameScreen: React.FC<TNSConsultNameProps> = ({
                                                                      onClose,
                                                                      navigateBackTo,
                                                                    }) => {
  const { name } = useTNS();

  const { setLoadingFullScreen } = useFeedbacks();
  const { token, notFound, loadingToken } = useToken(
    name,
    process.env.TLD || ""
  );
  const { tokens, loadingTokens } = useTokenList();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingToken);
  }, [loadingToken]);
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

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
            {isTokenOwnedByUser(tokens, name) && !notFound ? (
              <OwnerActions onClose={onClose} />
            ) : !notFound ? (
              <NotOwnerActions />
            ) : null}
            {!!token && !!name && (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                {isTokenOwnedByUser(tokens, name) ? (
                  <CopyToClipboard
                    text={`https://${window.location.host}/tns/token/${name}`}
                    squaresBackgroundColor={neutral17}
                  />
                ) : (
                  <>
                    {!!token.contract_address && (
                      <CopyToClipboard
                        text={token.contract_address}
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
