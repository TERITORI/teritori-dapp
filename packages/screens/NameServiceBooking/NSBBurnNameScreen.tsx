import { useFocusEffect } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, View } from "react-native";

import burnPNG from "../../../assets/icons/burn.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { NameNFT } from "../../components/NameServiceBooking/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { DarkButton } from "../../components/buttons/DarkButton";
import { NSBContext } from "../../context/NSBProvider";
import { useHasUserConnectedWallet } from "../../hooks/useHasUserConnectedWallet";
import { neutral33 } from "../../utils/colors";
import { useAppNavigation } from "../../utils/navigation";

export const NSBBurnNameScreen: React.FC = () => {
  const { name } = useContext(NSBContext);
  const userHasCoWallet = useHasUserConnectedWallet();
  //TODO: Is user owner ?
  const navigation = useAppNavigation();

  // ---- When this screen is called, if there is no selected name, or if the user has no wallet, or if he's not the owner, we go back
  useFocusEffect(() => {
    if (!name || !userHasCoWallet) navigation.navigate("NSBHome");
  });

  return (
    <ScreenContainer2
      footerChildren={<BacKTo label={name} navItem="NSBConsultName" />}
    >
      <View
        style={{
          flex: 1,
          marginTop: 32,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <NameNFT name={name} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            height: 404,
            maxHeight: 404,
            minHeight: 404,
            width: "100%",
            maxWidth: 396,
            borderColor: neutral33,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#000000",
            padding: 24,
            marginLeft: 20,
          }}
        >
          <View>
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "row" }}
            >
              <Image
                source={burnPNG}
                style={{ width: 32, height: 32, marginRight: 16 }}
              />
              <BrandText style={{ fontSize: 32, lineHeight: 44 }}>
                Burn {name}
              </BrandText>
            </View>
            <BrandText
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: "#A3A3A3",
                marginTop: 16,
              }}
            >
              This will permanently destroy the token. The token will no longer
              be visible from the name service and another token with the same
              name will be mintable.
            </BrandText>
          </View>

          <DarkButton
            text="I understand, burn it"
            onPress={() => {
              /*TODO:*/
            }}
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </ScreenContainer2>
  );
};
