import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

import { NameNFT } from "./NameNFT";
import { NameStatus } from "./NameStatus";
import { neutral17 } from "../../utils/style/colors";
import { TextInputCustom } from "../inputs/TextInputCustom";

// TODO: Maybe it can be a screen that is called in Register and Explore flow... TNSRegisterScreen.tsx and TNSExploreScreen.tsx have duplicated code

// A title + Name status (minted or available) + NFT card + optional buttons
export const FindAName: React.FC<{
  name: string;
  setName: (text: string) => void;
  nameError?: boolean;
  nameAvailable?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
  nameNFTStyle?: ViewStyle;
  children?: ReactNode;
}> = ({
  name,
  setName,
  nameError,
  nameAvailable,
  loading,
  children,
  containerStyle,
  nameNFTStyle,
}) => {
  return (
    <View style={[{ flex: 1, alignItems: "center" }, containerStyle]}>
      <TextInputCustom<{ name: string }>
        name="name"
        label="NAME"
        placeHolder="Type name here"
        style={{ marginBottom: 12 }}
        onChangeText={setName}
        value={name || ""}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
        squaresBackgroundColor={neutral17}
      />

      {!loading ? (
        <>
          {/*----- When a name is entered, we display its status */}
          {name ? (
            <NameStatus available={nameAvailable} hasError={nameError} />
          ) : null}
          {/*----- If name entered and no error, we display the image */}
          {name && !nameError ? (
            <NameNFT
              style={[
                {
                  marginTop: 12,
                  marginBottom: children ? 20 : 0,
                },
                nameNFTStyle,
              ]}
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
