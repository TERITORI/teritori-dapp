import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import ModalBase from "../../components/modals/GradientModalBase";
import { SendFundModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { neutral17 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

interface TNSExploreScreenProps extends TNSModalCommonProps {}

export const TNSExploreScreen: React.FC<TNSExploreScreenProps> = ({
  onClose,
}) => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const { name, setName } = useTNS();
  const isKeplrConnected = useIsKeplrConnected();
  const { setLoadingFullScreen } = useFeedbacks();
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
    <ModalBase
      label="Find a name"
      hideMainSeparator
      onClose={() => onClose()}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      width={457}
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
              size="XL"
              width={154}
              text="View"
              onPress={() => {
                setName(name);
                onClose("TNSConsultName");
              }}
              squaresBackgroundColor={neutral17}
            />
            <PrimaryButtonOutline
              size="XL"
              width={154}
              disabled={!isKeplrConnected}
              text="Send funds"
              onPress={() => setSendFundsModalVisible(true)}
              squaresBackgroundColor={neutral17}
            />
          </View>
        ) : null}
      </FindAName>

      <SendFundModal
        onClose={() => setSendFundsModalVisible(false)}
        visible={sendFundsModalVisible}
      />
    </ModalBase>
  );
};
