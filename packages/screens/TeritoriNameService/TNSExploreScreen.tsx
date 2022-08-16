import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BacKTo } from "../../components/Footer";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { FindAName } from "../../components/TeritoriNameService/FindAName";
import { SendFundModal } from "../../components/TeritoriNameService/SendFundsModal";
import { HollowPrimaryButton } from "../../components/buttons/HollowPrimaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TNSContext } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useStore } from "../../store/cosmwasm";
import { useAppNavigation } from "../../utils/navigation";
import { isTokenOwnedByUser } from "../../utils/tns";
import {useIsKeplrConnected} from "../../hooks/useIsKeplrConnected"

export const TNSExploreScreen: React.FC = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected()
  const { name, setName, setTnsLoading } = useContext(TNSContext);
  const { tokens, loadingTokens } = useTokenList();
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync tnsLoading
  useEffect(() => {
    setTnsLoading(loadingTokens);
  }, [loadingTokens]);

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
              big
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
    </ScreenContainer2>
  );
};
