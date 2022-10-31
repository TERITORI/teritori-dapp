import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect } from "react";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import ModalBase from "../../components/modals/GradientModalBase";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { TNSCloseHandler } from "./TNSHomeScreen";

interface TNSRegisterScreenProps {
  onClose: TNSCloseHandler;
}

export const TNSRegisterScreen: React.FC<TNSRegisterScreenProps> = ({
  onClose,
}) => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { name, setName } = useTNS();
  const { setLoadingFullScreen } = useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    if (!isKeplrConnected) navigation.navigate("TNSHome");
  });

  return (
    <ModalBase
      onClose={onClose}
      label="Find a name"
      width={457}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      hideMainSeparator
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
        nameNFTStyle={{
          backgroundColor: neutral00,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
          paddingBottom: 48,
          width: "100%",
        }}
      >
        {name &&
        !nameError &&
        nameAvailable &&
        !isTokenOwnedByUser(tokens, name) ? (
          <PrimaryButton
            size="XL"
            width={280}
            squaresBackgroundColor={neutral17}
            text="Register your Username"
            onPress={() => {
              setName(name);
              onClose("TNSMintName");
            }}
          />
        ) : null}

        {name && !nameError && !nameAvailable && (
          <PrimaryButton
            size="XL"
            width={280}
            text="Go to User Profile"
            onPress={() => {
              onClose();
              navigation.navigate("UserPublicProfile", {
                id: `tori-${selectedWallet?.address}`,
              });
            }}
            squaresBackgroundColor={neutral17}
          />
        )}
      </FindAName>
    </ModalBase>
  );
};
