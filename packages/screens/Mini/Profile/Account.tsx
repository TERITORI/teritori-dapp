import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { SvgProps } from "react-native-svg";

import copySVG from "../../../../assets/icons/copy-gray.svg";
import dotSVG from "../../../../assets/icons/dots-gray.svg";
import infoSVG from "../../../../assets/icons/info-circle-gray.svg";
import openSVG from "../../../../assets/icons/open-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold22 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { copyToClipboard } from "../Wallet/TransactionDetailScreen";
import { DropdownWithListItem } from "../components/Dropdown/DropdownWithListItem";

type AccountProps = {
  accountName: string;
  logo?: string | FC<SvgProps>;
  address: string;
  isLast?: boolean;
};

export const Account = ({
  accountName,
  logo,
  address,
  isLast = false,
}: AccountProps) => {
  const navigation = useAppNavigation();
  const navigateToAccountDetails = () => {
    navigation.replace("MiniAccountDetails", { id: "12345", accountName });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        paddingVertical: layout.spacing_x1_5,
        marginBottom: isLast ? 0 : layout.spacing_x1_5,
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontSemibold22]}>{accountName}</BrandText>
          <Pressable onPress={() => copyToClipboard(address)}>
            <SVG source={copySVG} height={20} width={20} />
          </Pressable>
        </View>

        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          {`${tinyAddress(address, 16)}`}
        </BrandText>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1,
        }}
      >
        {logo && (
          <CustomPressable
            style={{
              backgroundColor: neutral33,
              padding: layout.spacing_x1,
              borderRadius: 10,
              zIndex: -10,
            }}
          >
            <SVGorImageIcon icon={logo} iconSize={20} />
          </CustomPressable>
        )}
        <DropdownWithListItem
          style={{ paddingHorizontal: 0, width: 210 }}
          positionStyle={{ top: 35 }}
          icon={dotSVG}
          iconSize={22}
          items={[
            {
              name: "View on Explorer",
              icon: openSVG,
              onPress: () => alert("Hello Teritoriscan"),
            },
            {
              name: "Account Details",
              icon: infoSVG,
              onPress: navigateToAccountDetails,
            },
          ]}
        />
      </View>
    </View>
  );
};
