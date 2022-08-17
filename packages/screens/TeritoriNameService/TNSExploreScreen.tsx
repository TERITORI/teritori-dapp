import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { SendFundModal } from "../../components/teritoriNameService/SendFundsModal";
import { HollowPrimaryButton } from "../../components/buttons/HollowPrimaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { FeedbacksContext } from "../../context/FeedbacksProvider";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { useAppNavigation } from "../../utils/navigation";
import { isTokenOwnedByUser } from "../../utils/tns";

export const TNSExploreScreen: React.FC = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const { name, setName } = useContext(TNSContext);
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const { setLoadingFullScreen } = useContext(FeedbacksContext);
  const { tokens, loadingTokens } = useTokenList();
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  return (
    <ScreenContainer
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
      footerChildren={<BackTo label="Back to home" navItem="TNSHome" />}
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
      >
        {/*-----  If name entered, no error and if the name is minted, we display some buttons for Explore flow */}
        {name &&
        !nameError &&
        !nameAvailable &&
        !isTokenOwnedByUser(tokens, name) ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 56,
              maxHeight: 56,
              minHeight: 56,
              maxWidth: 332,
              width: "100%",
            }}
          >
            <PrimaryButton
              text="View"
              style={{ maxWidth: 157, width: "100%" }}
              onPress={() => navigation.navigate("TNSConsultName", { name })}
            />
            <HollowPrimaryButton
              disabled={!isKeplrConnected}
              text="Send funds"
              style={{ maxWidth: 154, width: "100%" }}
              onPress={() => setSendFundsModalVisible(true)}
            />
          </View>
        ) : null}
      </FindAName>

      <SendFundModal
        onClose={() => setSendFundsModalVisible(false)}
        visible={sendFundsModalVisible}
      />
    </ScreenContainer>
  );
};
