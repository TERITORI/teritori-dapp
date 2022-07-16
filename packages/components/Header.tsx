import logoTopPNG from "../../assets/logo-top.png"

{/*TODO: STEP3*/}

import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
} from "react-native"

import {useAppNavigation } from "../utils/navigation";
import {headerHeight} from "../utils/layout"
import {WalletSelector} from "./WalletSelector"

{/*TODO: Is it a good name for this cpt ?*/}
export const Header: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        height: headerHeight, maxHeight: headerHeight,
        width: "100%",
        flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          source={logoTopPNG}
          style={{
            width: 68,
            height: 68,
            resizeMode: "contain",
            marginLeft: 22
          }}
        />
      </TouchableOpacity>

      <WalletSelector style={{ marginRight: 22}}/>

    </View>
  );
};
