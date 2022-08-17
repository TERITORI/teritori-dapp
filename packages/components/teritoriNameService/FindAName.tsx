import React from "react";
import { View } from "react-native";

import { BrandText } from "../BrandText";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { NameNFT } from "./NameNFT";
import { NameStatusCard } from "./NameStatusCard";

// TODO: Maybe it can be a screen that is called in Register and Explore flow... TNSRegisterScreen.tsx and TNSExploreScreen.tsx have duplicated code

// A title + Name status (minted or available) + NFT card + optional buttons
export const FindAName: React.FC<{
  name: string;
  setName: (text: string) => void;
  nameError?: boolean;
  nameAvailable?: boolean;
  loading?: boolean;
}> = ({ name, setName, nameError, nameAvailable, loading, children }) => {
  const titleFontSize = 48;

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {/*TODO: Gradient text green-blue*/}
      <BrandText
        style={{
          fontSize: titleFontSize,
          lineHeight: 64,
          letterSpacing: -(titleFontSize * 0.04),
          marginBottom: 24,
          marginTop: 32,
        }}
      >
        Find a name
      </BrandText>

      <TextInputCustom
        label="NAME"
        placeHolder="Type name here"
        style={{ marginBottom: 12 }}
        onChangeText={setName}
        value={name || ""}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
      />

      {!loading ? (
        <>
          {/*----- When a name is entered, we display its status */}
          {name ? (
            <NameStatusCard available={nameAvailable} hasError={nameError} />
          ) : null}
          {/*----- If name entered and no error, we display the image */}
          {name && !nameError ? (
            <NameNFT
              style={{ marginTop: 12, marginBottom: children ? 20 : 0 }}
              name={name}
            />
          ) : null}
          {/*----- One or two buttons here */}
          <>{children}</>
        </>
      ) : null}
    </View>
  );
};
