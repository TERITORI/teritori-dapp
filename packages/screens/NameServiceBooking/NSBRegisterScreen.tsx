import React, { useContext } from "react";

import { BacKTo } from "../../components/Footer";
import { FindAName } from "../../components/NameServiceBooking/FindAName";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { NSBContext } from "../../context/NSBProvider";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useAppNavigation } from "../../utils/navigation";

export const NSBRegisterScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { name, setName } = useContext(NSBContext);
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(name);

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
        {/*-----  If name entered, no error and if the name is minted, we display two buttons for Register flow*/}
        {name && !nameError && !nameAvailable ? (
          <PrimaryButton
            text="View"
            big
            style={{ maxWidth: 157, width: "100%" }}
            onPress={() => navigation.navigate("NSBConsultName")}
          />
        ) : null}
        {name && !nameError && nameAvailable ? (
          <PrimaryButton
            text="Mint your new ID"
            big
            style={{ maxWidth: 157, width: "100%" }}
            onPress={() => navigation.navigate("NSBEditCreateName")}
          />
        ) : null}
      </FindAName>
    </ScreenContainer2>
  );
};
