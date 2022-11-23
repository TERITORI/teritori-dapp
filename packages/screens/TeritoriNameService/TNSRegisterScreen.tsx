import React from "react";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import GradientModalBase from "../../components/modals/GradientModalBase";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
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
  const { tokens } = useTokenList();
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  return (
    <GradientModalBase
      onClose={() => onClose()}
      label="Find a name"
      width={457}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      hideMainSeparator
      scrollable
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
              //TODO : get wallet address from name and redirect to correct address
              navigation.navigate("UserPublicProfile", {
                id: `tori-${selectedWallet?.address}`,
              });
            }}
            squaresBackgroundColor={neutral17}
          />
        )}
      </FindAName>
    </GradientModalBase>
  );
};
