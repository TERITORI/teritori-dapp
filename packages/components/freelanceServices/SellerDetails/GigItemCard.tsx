import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import dotsCircle from "../../../../assets/icons/dots-circle.svg";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold12,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { GigInfo } from "../types/fields";

export const GigItemCard: React.FC<{
  width: number;
  height: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  data: GigInfo;
  isEditable: boolean;
}> = ({ width, height, mainContainerStyle, boxStyle, data, isEditable }) => {
  const navigation = useAppNavigation();
  const manageList = ["Edit"];
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    data && (
      <TertiaryBox
        width={width}
        height={height}
        mainContainerStyle={[mainContainerStyle]}
        style={[boxStyle]}
      >
        {data.images.length > 0 && (
          <Image
            source={{ uri: ipfsURLToHTTPURL(data.images[0]) }}
            style={{ width: 120, height: 120 }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            marginTop: 8,
            marginLeft: 8,
            height: 18,
            width: 180,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("FreelanceServicesGigDetail", {
                gigId: data.id!,
              });
            }}
          >
            <BrandText
              style={[fontSemibold12, { width: 180, overflow: "hidden" }]}
            >
              {data.title}
            </BrandText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
            width: 180,
          }}
        >
          {isEditable && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setOpenMenu(!openMenu);
                }}
              >
                <SVG source={dotsCircle} width={32} height={32} />
              </TouchableOpacity>
            </View>
          )}
          {!isEditable && <View />}
          <View style={{ flexDirection: "column" }}>
            <BrandText style={[fontSemibold14]}>
              {`${Math.ceil(parseFloat(data.basicPackage.price))} TORI`}
            </BrandText>
          </View>
        </View>
        {openMenu && (
          <View
            style={{
              backgroundColor: "#292929",
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: layout.spacing_x1_5,
              paddingVertical: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x1,
              position: "absolute",
              bottom: 50,
              width: "100%",
              zIndex: 10,
            }}
          >
            {manageList.map((item: string, index: number) => (
              <Pressable
                // @ts-ignore
                onMouseEnter={() => setHoveredIndex(index + 1)}
                onMouseLeave={() => setHoveredIndex(0)}
                onPress={() => {
                  if (item === "Edit") {
                    navigation.navigate("FreelanceServicesGigCreation", {
                      gigId: data.id,
                    });
                  }
                  setOpenMenu(false);
                }}
                key={index}
              >
                <BrandText
                  style={
                    hoveredIndex === index + 1
                      ? StyleSheet.flatten([
                          fontMedium13,
                          {
                            backgroundColor: neutral33,
                            borderRadius: 6,
                            padding: layout.spacing_x1,
                          },
                        ])
                      : StyleSheet.flatten([
                          fontMedium13,
                          {
                            color: neutralA3,
                            padding: layout.spacing_x1,
                          },
                        ])
                  }
                >
                  {item}
                </BrandText>
              </Pressable>
            ))}
          </View>
        )}
      </TertiaryBox>
    )
  );
};
