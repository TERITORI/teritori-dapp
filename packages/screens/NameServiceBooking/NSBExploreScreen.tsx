import React, { useContext, useEffect } from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HollowPrimaryButton } from "../../components/buttons/HollowPrimaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { FindAName } from "../../components/teritorinameService/FindAName";
import { FeedbacksContext } from "../../context/FeedbacksProvider";
import { NSBContext } from "../../context/NSBProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { isTokenOwned } from "../../utils/handefulFunctions";
import { useAppNavigation } from "../../utils/navigation";

export const NSBExploreScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { name, setName } = useContext(NSBContext);
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
      footerChildren={<BackTo label="Back to home" navItem="NSBHome" />}
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
        {name && !nameError && !nameAvailable && !isTokenOwned(tokens, name) ? (
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
              width={156}
              text="View"
              onPress={() => navigation.navigate("NSBConsultName")}
            />
            <HollowPrimaryButton
              width={156}
              text="Send funds"
              onPress={() => {
                /*TODO:*/
              }}
            />
          </View>
        ) : null}
      </FindAName>
    </ScreenContainer>
  );
};
