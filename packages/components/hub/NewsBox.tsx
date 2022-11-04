import React from "react";
import {
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  View,
} from "react-native";

import { neutral33, neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";

export type News = {
  title: string;
  subtitle: string;
  text: string;
  image: ImageSourcePropType;
  button1Label?: string;
  button1Action?: () => void;
  button2Label?: string;
  button2Action?: () => void;
  author?: string;
};

const breakPoint = 768;

export const NewsBox: React.FC<{
  news: News;
}> = ({ news }) => {
  const { width } = useWindowDimensions();

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
            <BrandText style={[fontSemibold28, { color: primaryColor }]}>
              {news.title}
            </BrandText>
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
            {news.button1Label ? (
              <SecondaryButton
                backgroundColor="#FFFFFF"
                color="#000000"
                size="SM"
                text={news.button1Label}
                onPress={news.button1Action ? news.button1Action : () => {}}
              />
            ) : null}
            {news.button2Label ? (
              <SecondaryButtonOutline
                style={{ marginLeft: 16 }}
                backgroundColor="#000000"
                size="SM"
                text={news.button2Label}
                onPress={news.button2Action ? news.button2Action : () => {}}
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
            // source={guardianPNG}
            source={news.image}
            style={{
              height: 342,
              width: 342,
              aspectRatio: 1,
              borderRadius: 10,
            }}
          />
          {news.author && (
            <BrandText
              style={[
                fontMedium14,
                { position: "absolute", bottom: 22, right: 20 },
              ]}
            >
              {news.author}
            </BrandText>
          )}
        </View>
      </View>
    </View>
  );
};
