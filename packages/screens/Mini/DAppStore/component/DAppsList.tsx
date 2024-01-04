import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import addSVG from "../../../../../assets/icons/add-circle-blue.svg";
import linesSVG from "../../../../../assets/icons/lines-gray.svg";
import minusSVG from "../../../../../assets/icons/minus-circle-red.svg";
import astroportPNG from "../../../../../assets/icons/networks/Astroport.png";
import axelarPNG from "../../../../../assets/icons/networks/axelar.png";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
type Props = {
  isEditing: boolean;
  togggleEdting: () => void;
};

export const DAppsList = ({ isEditing, togggleEdting }: Props) => {
  return (
    <View style={{ paddingBottom: isEditing ? 100 : 0 }}>
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
        isAdded
      />
      <IndividualDApp
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
        isAdded
      />
      <Separator />
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <IndividualDApp
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <IndividualDApp
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <IndividualDApp
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <IndividualDApp
        icon={astroportPNG}
        title="Powerful DEX"
        subTitle="Powerful DEX"
        isEditing={isEditing}
        onPress={() => alert("Powerful DEX")}
      />
      <IndividualDApp
        icon={axelarPNG}
        title="Axelar Network"
        subTitle="Secure building"
        isEditing={isEditing}
        onPress={() => alert("Axelar Network")}
      />
      <IndividualDApp
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

type IndividualDAppProps = {
  icon: ImageSourcePropType;
  title: string;
  subTitle?: string;
  onPress?: () => void;
  isAdded?: boolean;
  isEditing?: boolean;
};
const IndividualDApp = ({
  icon,
  title,
  onPress,
  subTitle,
  isAdded = false,
  isEditing = false,
}: IndividualDAppProps) => {
  if (!isAdded && !isEditing) {
    return null;
  }
  return (
    <CustomPressable
      onPress={onPress}
      style={{
        paddingVertical: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        {isEditing && isAdded && <SVG source={minusSVG} />}
        {isEditing && !isAdded && <SVG source={addSVG} />}
        <Image
          source={{ uri: Image.resolveAssetSource(icon).uri }}
          height={24}
          width={24}
        />
        <View>
          <BrandText style={[fontSemibold22, {}]}>{title}</BrandText>
          {subTitle && (
            <BrandText style={[fontMedium13, { color: neutralA3 }]}>
              {subTitle}
            </BrandText>
          )}
        </View>
      </View>
      {isEditing && isAdded && <SVG source={linesSVG} height={20} width={20} />}
    </CustomPressable>
  );
};
