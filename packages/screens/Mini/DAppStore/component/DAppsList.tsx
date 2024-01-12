import React from "react";
import { View } from "react-native";

import { DAppStoreMenuItem } from "./DAppStoreMenuItems";
import astroportPNG from "../../../../../assets/icons/networks/Astroport.png";
import axelarPNG from "../../../../../assets/icons/networks/axelar.png";
import { Separator } from "../../../../components/separators/Separator";
type Props = {
  isEditing: boolean;
  togggleEdting: () => void;
};

export const DAppsList = ({ isEditing, togggleEdting }: Props) => {
  return (
    <View style={{ paddingBottom: isEditing ? 100 : 0 }}>
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
        isAdded
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
        isAdded
      />
      <Separator />
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <DAppStoreMenuItem
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <DAppStoreMenuItem
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      {/* {isEditing && (
        <CustomPressable
          onPress={togggleEdting}
          style={{
            width: "100%",
            backgroundColor: blueDefault,
            paddingVertical: layout.spacing_x1_5,
            borderRadius: 100,
            position: "absolute",
            top: 30,
          }}
        >
          <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
            Save
          </BrandText>
        </CustomPressable>
      )} */}
    </View>
  );
};
