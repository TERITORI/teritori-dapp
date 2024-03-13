import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import walletSVG from "../../../../assets/wallet-screen.svg";
import { CustomButton } from "../components/Button/CustomButton";
import MobileModal from "../components/MobileModal";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import ToggleButton from "@/components/buttons/ToggleButton";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import {
  fontMedium13,
  fontMedium16,
  fontSemibold16,
  fontSemibold30,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { AppMode } from "@/utils/types/app-mode";

const totalSlides = 2;

export const ModeSelectionScreen: ScreenFC<"ModeSelection"> = ({
  navigation,
}) => {
  const { width, height } = useWindowDimensions();
  const [openModal, setModal] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>("mini");
  const [activeIndex, setActiveIndex] = useState(0);

  const onNotNowPress = async () => {
    await AsyncStorage.setItem("ONBOARDED", "true");
    navigation.navigate("ChatActivation", { appMode });
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
        onScrollStart={() => {
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
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 10,
          right: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CustomButton
          title="Next"
          type="gray"
          onPress={onNotNowPress}
          width={width / 2 - 16}
        />
        <CustomButton
          title="Select mode"
          onPress={() => setModal(true)}
          width={width / 2 - 16}
        />
      </View>

      <MobileModal
        visible={openModal}
        onClose={() => setModal(false)}
        innerContainerOptions={{ height: "50%" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <SpacerColumn size={3} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: layout.spacing_x1_5,
              }}
            >
              <BrandText>Mini Mode</BrandText>
            </View>

            <ToggleButton
              isActive={appMode === "mini"}
              onValueChange={(value) => {
                if (value) {
                  setAppMode("mini");
                }
                setAppMode("web3Addict");
              }}
            />
          </View>
          <SpacerColumn size={1} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            Disabling this will run your app in web3Addict mode.
          </BrandText>
          <SpacerColumn size={1} />
        </View>
      </MobileModal>
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
