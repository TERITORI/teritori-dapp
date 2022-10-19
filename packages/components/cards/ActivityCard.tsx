import moment from "moment";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import externalSVG from "../../../assets/icons/external.svg";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { UserImageAddressInline } from "../UserImageAddressInline";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

export type ActivityType = {
  label: string;
  iconSVG: React.FC<SvgProps>;
};

//TODO: Use packages/api/marketplace/v1/marketplace.ts
export type Activity = {
  label: string;
  image: ImageSourcePropType;
  date: string;
  type: ActivityType;
  userFromAddress: string;
  userFromImage: string;
  userToAddress: string;
  userToImage: string;
};

export const ActivityCard: React.FC<{
  activity: Activity;
  style?: StyleProp<ViewStyle>;
}> = ({ activity, style }) => {
  return (
    <TertiaryBox
      fullWidth
      height={96}
      style={style}
      mainContainerStyle={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: layout.padding_x1_5,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* ---- Image */}
        <TertiaryBox>
          <Image
            source={activity.image}
            style={{ borderRadius: 7, width: 72, height: 72 }}
          />
        </TertiaryBox>

        <View
          style={{ justifyContent: "center", marginLeft: layout.padding_x2 }}
        >
          {/* ---- Label */}
          <BrandText style={fontSemibold14}>{activity.label}</BrandText>

          {/* ---- Users */}
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutral77,
                display: "flex",
                marginVertical: layout.padding_x0_5,
              },
            ]}
          >
            1 edition transferred from
            <UserImageAddressInline
              address={activity.userFromAddress}
              imageSource={activity.userFromImage}
              style={{ marginHorizontal: layout.padding_x1 }}
            />
            to
            <UserImageAddressInline
              address={activity.userToAddress}
              imageSource={activity.userToImage}
              style={{ marginLeft: layout.padding_x1 }}
            />
          </BrandText>

          {/* ---- Date Time */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              {moment(activity.date).format("DD.MM.YYYY")}
              {", "}
            </BrandText>
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              {moment(activity.date).format("HH:mm")}
            </BrandText>

            {/* ---- Link */}
            <TouchableOpacity
              onPress={() => Linking.openURL("/TODO")}
              style={{ marginLeft: layout.padding_x1_5 / 2 }}
            >
              <SVG source={externalSVG} width={16} height={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TertiaryBadge
        label={activity.type.label}
        iconSVG={activity.type.iconSVG}
        style={{ marginRight: 22 }}
      />
    </TertiaryBox>
  );
};
