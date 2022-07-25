import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BacKTo } from "../../components/Footer";
import { FindAName } from "../../components/NameServiceBooking/FindAName";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { HollowPrimaryButton } from "../../components/buttons/HollowPrimaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { NSBContext } from "../../context/NSBProvider";
import { getToken } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useAppNavigation } from "../../utils/navigation";

export const NSBExploreScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { name, setName } = useContext(NSBContext);
  const { nameAvailable, nameError, loading, isUserOwnsToken } =
    useCheckNameAvailability(name);

  return (
    <ScreenContainer2
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
        {/*-----  If name entered, no error and if the name is minted, we display some buttons for Explore flow */}
        {name && !nameError && !nameAvailable && !isUserOwnsToken ? (
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
              onPress={() => navigation.navigate("NSBConsultName")}
            />
            <HollowPrimaryButton
              text="Send funds"
              style={{ maxWidth: 154, width: "100%" }}
              onPress={() => {
                /*TODO:*/
              }}
            />
          </View>
        ) : null}
      </FindAName>
    </ScreenContainer2>
  );
};
