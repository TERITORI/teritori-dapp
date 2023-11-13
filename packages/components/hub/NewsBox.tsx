import { useLinkTo } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Image, Linking, useWindowDimensions, View } from "react-native";

import { News } from "../../api/marketplace/v1/marketplace";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral33, neutral77 } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { GradientText } from "../gradientText";

const breakPoint = 768;

export const NewsBox: React.FC<{
  news: News;
}> = ({ news }) => {
  const { width } = useWindowDimensions();
  const linkTo = useLinkTo();
  const navigateTo = useCallback(
    (to: string | undefined) => {
      if (!to) {
        return;
      }
      if (to.startsWith("/")) {
        linkTo(to);
        return;
      }
      Linking.openURL(to);
    },
    [linkTo],
  );

  return (
    <View
      style={{
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: neutral33,
        paddingHorizontal: 10,
        paddingVertical: 20,
      }}
    >
      <View
        style={[
          { width: "100%" },
          width > breakPoint
            ? {
                flexDirection: "row",
                justifyContent: "space-between",
              }
            : { flexDirection: "column-reverse" },
        ]}
      >
        <View
          style={[
            width > breakPoint ? { flex: 1 } : { width: "100%" },
            { justifyContent: "space-between", marginTop: 12 },
          ]}
        >
          <View>
            <GradientText gradientType="blueExtended" style={fontSemibold28}>
              {news.title}
            </GradientText>
            <BrandText style={fontSemibold20}>{news.subtitle}</BrandText>
          </View>

          <BrandText
            style={[fontSemibold14, { marginTop: 28, color: neutral77 }]}
          >
            {news.text}
          </BrandText>

          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              marginBottom: 12,
            }}
          >
            {news.actions.length > 0 ? (
              <SecondaryButton
                backgroundColor="#FFFFFF"
                color="#000000"
                size="SM"
                text={news.actions[0].label}
                onPress={() => navigateTo(news.actions[0].url)}
              />
            ) : null}
            {news.actions.length > 1 ? (
              <SecondaryButtonOutline
                style={{ marginLeft: 16 }}
                backgroundColor="#000000"
                size="SM"
                text={news.actions[1].label}
                onPress={() => navigateTo(news.actions[1].url)}
              />
            ) : null}
          </View>
        </View>

        <View
          style={
            width > breakPoint
              ? { marginLeft: 44 }
              : { marginBottom: 44, width: "100%", alignItems: "center" }
          }
        >
          <Image
            source={{ uri: ipfsURLToHTTPURL(news.image) }}
            style={{
              height: 342,
              width: 342,
              aspectRatio: 1,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};
