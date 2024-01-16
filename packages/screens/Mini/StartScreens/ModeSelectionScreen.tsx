import React, { useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import walletSVG from "../../../../assets/wallet-screen.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenFC } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold16,
  fontSemibold30,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/CustomButton";

const totalSlides = 2;

export const ModeSelectionScreen: ScreenFC<"ModeSelection"> = ({
  navigation,
}) => {
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const onSelectModePress = () => {
    navigation.navigate("ChatActivation");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
        alignItems: "center",
      }}
    >
      <BrandText
        style={[
          fontSemibold16,
          {
            marginTop: layout.spacing_x1_5,
            width: 164,
            textAlign: "center",
          },
        ]}
      >
        Which platform mode do you want to use?
      </BrandText>
      <Carousel
        loop
        width={width}
        pagingEnabled
        height={height - 300}
        autoPlay
        data={[...new Array(2).keys()]}
        scrollAnimationDuration={1000}
        // onSnapToItem={(index) => setActiveIndex(index)}
        onScrollBegin={() => {
          setActiveIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
        }}
        renderItem={({ index }) =>
          index === 0 ? <FirstScreen /> : <FirstScreen />
        }
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
        {Array.from({ length: totalSlides }).map((x, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: activeIndex === idx ? "#fff" : "#fff7",
              height: 5,
              width: 5,
              borderRadius: 5,
            }}
          />
        ))}
      </View>
      <CustomButton
        title="Select mode"
        onPress={onSelectModePress}
        width={windowWidth - 20}
        style={{
          position: "absolute",
          bottom: 50,
          left: 10,
          right: 10,
        }}
      />
    </SafeAreaView>
  );
};

const FirstScreen = () => {
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG source={walletSVG} />
      <BrandText
        style={[
          fontSemibold30,
          {
            marginTop: layout.spacing_x1_5,
            marginBottom: layout.spacing_x1,
            textAlign: "center",
          },
        ]}
      >
        Minimalistic
      </BrandText>
      <BrandText
        style={[
          fontMedium16,
          {
            color: neutral77,
            textAlign: "center",
            width: 200,
            lineHeight: 22,
          },
        ]}
      >
        Perfect for simplicity & intuitive experience, similar to your daily
        behaviors
      </BrandText>
    </View>
  );
};
