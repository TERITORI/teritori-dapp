import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";

import { BacKTo } from "../../components/Footer";
import { FindAName } from "../../components/NameServiceBooking/FindAName";
import { ScreenContainerNSB } from "../../components/NameServiceBooking/ScreenContainerNSB";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { NSBContext } from "../../context/NSBProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useStore } from "../../store/cosmwasm";
import { isTokenOwned } from "../../utils/handefulFunctions";
import { useAppNavigation } from "../../utils/navigation";

export const NSBRegisterScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { name, setName, setNsbLoading } = useContext(NSBContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync nsbLoading
  useEffect(() => {
    setNsbLoading(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    if (!signingClient) navigation.navigate("NSBHome");
  });

  return (
    <ScreenContainerNSB
      footerChildren={<BacKTo label="home" navItem="NSBHome" />}
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
      >
        {name && !nameError && nameAvailable && !isTokenOwned(tokens, name) ? (
          <PrimaryButton
            text="Mint your new ID"
            big
            style={{ maxWidth: 157, width: "100%" }}
            onPress={() => navigation.navigate("NSBMintName", { name })}
          />
        ) : null}
      </FindAName>
    </ScreenContainerNSB>
  );
};
