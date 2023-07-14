import Clipboard from "@react-native-clipboard/clipboard";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Linking,
  Platform,
} from "react-native";

import heartIcon from "../../../../assets/icons/Pathwar/heartIcon.svg";
import shareIcon from "../../../../assets/icons/Pathwar/shareIcon.svg";
import { Resources, Tag } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  gradientColorBlue,
  neutral00,
  withAlpha,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const TitleDescription: React.FC<{
  playing: boolean;
  title: string;
  description: string;
}> = ({ description, playing, title }) => (
  <View
    style={{
      zIndex: 3,
      display: playing ? "none" : "flex",
      backgroundColor: withAlpha(neutral00, 0.3),
      width: 330,
      height: 86,
      borderRadius: 8,
      alignContent: "center",
      justifyContent: "center",
      marginLeft: layout.padding_x1_5,
      marginBottom: playing ? "10%" : "2%",
    }}
  >
    <View
      style={{
        justifyContent: "flex-start",
        alignContent: "flex-start",
        height: "100%",
        marginLeft: layout.padding_x1_5,
      }}
    >
      <BrandText style={[{ marginTop: layout.padding_x1_5 }, fontSemibold20]}>
        {title}
      </BrandText>
      <ScrollView style={{ height: 60 }}>
        <BrandText
          ellipsizeMode="tail"
          numberOfLines={2}
          style={[{ marginBottom: layout.padding_x0_5 }, fontSemibold13]}
        >
          {description}
        </BrandText>
      </ScrollView>
    </View>
  </View>
);

const LikeShare: React.FC<{ playing: boolean }> = ({ playing }) => {
  const { setToastSuccess } = useFeedbacks();

  return (
    <View
      style={{
        flexDirection: "row",
        marginRight: layout.padding_x1_5,
        display: playing ? "none" : "flex",
        zIndex: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          let currentUrl;
          if (Platform.OS === "web") {
            currentUrl = window.location.href;
          }

          try {
            Clipboard.setString(currentUrl || "");
            setToastSuccess({
              title: "URL Copied!",
              message: "",
            });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <View
          style={{
            backgroundColor: withAlpha(neutral00, 0.3),
            borderRadius: 8,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginRight: layout.padding_x0_5,
          }}
        >
          <SVG source={shareIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View
          style={{
            backgroundColor: withAlpha(neutral00, 0.3),
            borderRadius: 8,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={heartIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Pills: React.FC<{ data: Tag[]; backgroundColor: string }> = ({
  data,
  backgroundColor,
}) => {
  return (
    <>
      {data.map((tag) => (
        <View
          style={{
            backgroundColor,
            borderRadius: 8,
            width: "fit-content",
            height: "fit-content",
            marginRight: layout.padding_x0_5,
          }}
        >
          <BrandText
            style={[
              {
                paddingLeft: layout.padding_x1,
                paddingRight: layout.padding_x1,
                paddingTop: layout.padding_x0_5,
                paddingBottom: layout.padding_x0_5,
                textTransform: "capitalize",
              },
              fontSemibold13,
            ]}
          >
            {tag.text}
          </BrandText>
        </View>
      ))}
    </>
  );
};

export const ResourceBox: React.FC<{ data: Resources }> = ({ data }) => {
  const isMobile = useIsMobile();
  const isVideo = () => data.category.some((item) => item.text === "video");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <TertiaryBox
      width={isMobile ? 320 : 640}
      height={330}
      style={{
        marginRight: layout.padding_x1_5,
        marginTop: layout.padding_x1_5,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          width: isMobile ? 320 : 640,

          height: 330,
        }}
      >
        {isVideo() && (
          <Video
            style={{
              zIndex: 1,
              height: 330,
              left: 0,
              position: "absolute",
            }}
            source={{
              uri: data.url,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            onPlaybackStatusUpdate={(e) => {
              if (e.isLoaded) {
                setIsPlaying(e.isPlaying);
              }
            }}
          />
        )}
        {!isVideo() && (
          <Pressable
            style={{
              zIndex: 2,
            }}
            onPress={() => {
              Linking.openURL(data.url);
            }}
          >
            <OptimizedImage
              style={{
                zIndex: 1,
                height: 330,
                width: 640,
                left: 0,
                position: "absolute",
              }}
              width={640}
              height={330}
              sourceURI={data.thumbnail}
            />
          </Pressable>
        )}
        <View
          style={{
            zIndex: 3,
            display: isPlaying ? "none" : "flex",
            marginTop: layout.padding_x1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", marginLeft: layout.padding_x1 }}>
            <Pills
              data={data.category}
              backgroundColor={withAlpha(neutral00, 0.3)}
            />
            <Pills
              data={data.tags}
              backgroundColor={withAlpha(gradientColorBlue, 0.9)}
            />
          </View>
          <LikeShare playing={isPlaying} />
        </View>
        <Pressable
          style={{
            bottom: 25,
            zIndex: 2,
            position: "absolute",
          }}
          onPress={() => {
            Linking.openURL(data.url);
          }}
          disabled={isVideo()}
        >
          <TitleDescription
            playing={isPlaying}
            title={data.title}
            description={data.description}
          />
        </Pressable>
      </View>
    </TertiaryBox>
  );
};
