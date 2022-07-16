
{/*TODO: STEP3*/}

import React from "react";
import {
    View,
    Image,
    ImageSourcePropType,
    TouchableOpacity,
} from "react-native";

import governanceIconPNG from "../../assets/icons/governance.png";
import guardiansIconPNG from "../../assets/icons/guardians.png";
import launchpadIconPNG from "../../assets/icons/launchpad.png";
import marketplaceIconPNG from "../../assets/icons/marketplace.png";
import sidebarBottomPNG from "../../assets/sidebar-bottom.png";
import sidebarContainerSelectedPNG from "../../assets/sidebar-container-selected.png";
import sidebarContainerPNG from "../../assets/sidebar-container.png";
import sidebarTopPNG from "../../assets/sidebar-top.png";
import { neutral33 } from "../utils/colors";
import { getCurrentRouteName, useAppNavigation } from "../utils/navigation";
import {headerHeight} from "../utils/layout"

// const borderWidth = 1;

{/*TODO: Is it a good name for this cpt ?*/}

export const Header: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        height: headerHeight, maxHeight: headerHeight,
        width: "100%",
        flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        // backgroundColor: "#2f3f51"
      }}
    >

    </View>
  );
};
