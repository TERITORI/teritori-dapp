import React, { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";

import osmosisLogo from "../../../../../assets/icons/networks/osmosis.svg";
import settingsSVG from "../../../../../assets/icons/settings.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { layout } from "../../../../utils/style/layout";

export const SwapHeader: React.FC<{
  setSettingsOpened?: Dispatch<SetStateAction<boolean>>;
  networkDisplayName?: string;
}> = ({ setSettingsOpened, networkDisplayName }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SVG source={osmosisLogo} height={32} width={32} />
        <BrandText
          style={{
            marginLeft: layout.spacing_x2,
          }}
        >
          Swap on {networkDisplayName || "Osmosis"}
        </BrandText>
      </View>
      {setSettingsOpened && (
        <TouchableOpacity
          onPress={() => setSettingsOpened((isOpened) => !isOpened)}
        >
          <SVG source={settingsSVG} height={20} width={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};
