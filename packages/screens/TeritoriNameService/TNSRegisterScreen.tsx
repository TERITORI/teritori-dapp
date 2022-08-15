import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";

import { BacKTo } from "../../components/Footer";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { FindAName } from "../../components/TeritoriNameService/FindAName";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useStore } from "../../store/cosmwasm";
import { useAppNavigation } from "../../utils/navigation";
import { isTokenOwned } from "../../utils/tns";

export const TNSRegisterScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { name, setName, setTnsLoading } = useContext(TNSContext);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync tnsLoading
  useEffect(() => {
    setTnsLoading(loadingTokens);
  }, [loadingTokens]);

  // ==== Init
  useFocusEffect(() => {
    if (!signingClient) navigation.navigate("TNSHome");
  });

  return (
    <ScreenContainer2
      footerChildren={<BacKTo label="home" navItem="TNSHome" />}
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
            onPress={() => navigation.navigate("TNSMintName", { name })}
          />
        ) : null}
      </FindAName>
    </ScreenContainer2>
  );
};
