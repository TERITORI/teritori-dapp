import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NameAndTldText } from "../../components/TeritoriNameService/NameAndTldText";
import { NameNFT } from "../../components/TeritoriNameService/NameNFT";
import { SendFundModal } from "../../components/TeritoriNameService/SendFundsModal";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryAltButton } from "../../components/buttons/SecondaryAltButton";
import { CopyToClipboardCard } from "../../components/cards/CopyToClipboardCard";
import { BackTo } from "../../components/navigation/BackTo";
import { FeedbacksContext } from "../../context/FeedbacksProvider";
import { TNSContext } from "../../context/TNSProvider";
import { useToken, useTokenList } from "../../hooks/tokens";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { neutral33, neutral77 } from "../../utils/style/colors";
import {
  imageDisplayLabel,
  prettyTokenData,
  publicNameDisplayLabel,
} from "../../utils/teritori";
import { isTokenOwnedByUser } from "../../utils/tns";

const NotOwnerActions = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const isKeplrConnected = useIsKeplrConnected();
  const btnStyle = { marginLeft: 24, width: "fit-content" };
  return (
    <>
      <BackTo label="Back" />
      <PrimaryButton
        disabled={!isKeplrConnected}
        text="Send funds"
        style={btnStyle}
        // TODO: if no signed, conenctKeplr, then, open modal
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
  const { name } = useContext(TNSContext);
  return (
    <>
      <BackTo label="Back" />
      <SecondaryAltButton
        text="Update metadata"
        style={{ marginLeft: 24 }}
        onPress={() => navigation.navigate("TNSUpdateName", { name })}
      />
      <SecondaryAltButton
        text="Burn"
        style={{ marginLeft: 24 }}
        onPress={() => navigation.navigate("TNSBurnName", { name })}
      />
    </>
  );
};

export const TNSConsultNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSConsultName">;
}> = ({ route }) => {
  const { name, setName } = useContext(TNSContext);
  const { setLoadingFullScreen } = useContext(FeedbacksContext);
  const { token, notFound, loadingToken } = useToken(name, process.env.TLD);
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

  // ---- Setting the name from NSBContext. Redirects to TNSHome if this screen is called when the token is not minted
  useFocusEffect(() => {
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
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
          <BackTo navItem="TNSHome" label="Back to home" />
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
                <CopyToClipboardCard
                  text={`https://${window.location.host}/tns/token/${name}`}
                />
              ) : token && name && !isTokenOwnedByUser(tokens, name) ? (
                <CopyToClipboardCard text={token.contract_address} />
              ) : null}
            </View>

            <View
              style={{
                flex: 1,
                borderColor: neutral33,
                borderWidth: 1,
                borderRadius: 8,
                width: "100%",
                maxWidth: 396,
                height: "fit-content",
                padding: 24,
                // Remove the marginBottom of the last tokenData
                paddingBottom: -8,
              }}
            >
              {token ? (
                <>
                  <View style={{ flex: 1, marginBottom: 32 }}>
                    <BrandText
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        color: neutral77,
                      }}
                    >
                      Name
                    </BrandText>
                    <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
                      {name}
                    </BrandText>
                  </View>

                  {prettyTokenData(token)
                    // We display only the raw if there is a value
                    .filter((data) => data.value)
                    .map((data, i) => (
                      <View style={{ flex: 1, marginBottom: 32 }} key={i}>
                        <BrandText
                          style={{
                            fontSize: 16,
                            marginBottom: 8,
                            color: neutral77,
                          }}
                        >
                          {data.displayLabel}
                        </BrandText>
                        {/*---- We want some style depending on the data type*/}
                        {data.displayLabel === publicNameDisplayLabel ? (
                          <NameAndTldText nameAndTldStr={data.value} />
                        ) : data.displayLabel === imageDisplayLabel ? (
                          // TODO: Gradient text blue-green
                          <ExternalLink
                            externalUrl={data.value}
                            style={{ letterSpacing: -(20 * 0.04) }}
                            numberOfLines={1}
                          >
                            {data.value}
                          </ExternalLink>
                        ) : (
                          <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
                            {data.value}
                          </BrandText>
                        )}
                      </View>
                    ))}
                </>
              ) : (
                <BrandText>Loading</BrandText>
              )}
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
};
