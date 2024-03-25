import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useRef } from "react";
import {
  SafeAreaView,
  useWindowDimensions,
  View,
  PanResponder,
  Animated,
  GestureResponderEvent,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import chevronSVG from "../../../../assets/icons/chevron-left.svg";
import closeSVG from "../../../../assets/icons/close.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { fontSemibold18 } from "@/utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "@/utils/style/layout";

type Props = {
  children: ReactNode;
  title?: string;
  onGoBack?: () => void;
  background?: string | "transparent";
  customHeader?: ReactNode;
  noScrollView?: boolean;
};

export const BlurScreenContainer = ({
  children,
  title,
  onGoBack,
  background = "transparent",
  customHeader,
  noScrollView,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useAppNavigation();
  const onClose = () => navigation.goBack();
  const navigateToProfile = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.replace("MiniProfile");
    }
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const safeAreaInset = useSafeAreaInsets();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only set pan responder if the gesture is moving downward
        return (
          gestureState.dy > 0 &&
          gestureState.dy > Math.abs(gestureState.dx) &&
          !isTouchWithinFlatList(evt)
        );
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 50) {
          navigation.goBack();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const isTouchWithinFlatList = (evt: GestureResponderEvent) => {
    const { locationY } = evt.nativeEvent;
    return locationY > 0 && locationY < 100;
  };

  const WrapperComponent = noScrollView ? View : ScrollView;
  const wrapperComponentProps = noScrollView
    ? {
        style: {
          backgroundColor: background,
          flex: 1,
        },
      }
    : {
        scrollEnabled: false,
        contentContainerStyle: {
          backgroundColor: background,
          flex: 1,
        },
      };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: windowWidth,
        backgroundColor: background || "rgba(0, 0, 0, .2)",
        position: "relative",
        paddingTop: safeAreaInset.top,
      }}
    >
      <BlurView
        tint="dark"
        style={{
          position: "absolute",
          zIndex: 0,
          width: windowWidth,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor:
            Platform.OS === "android" ? "rgb(0,0,0)" : "transparent",
        }}
      />
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[
          "rgba(0,0,0,1)",
          "rgba(0,0,0,1)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.2)",
        ]}
        style={{
          flex: 1,
          borderRadius: 6,
          position: "absolute",
          zIndex: 0,
          width: windowWidth,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Animated.View
        style={{
          transform: [{ translateY: pan.y }],
          flex: 1,
        }}
        {...panResponder.panHandlers}
      >
        {customHeader ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: MOBILE_HEADER_HEIGHT,
            }}
          >
            {customHeader}
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: layout.spacing_x2,
              height: MOBILE_HEADER_HEIGHT,
            }}
          >
            {onGoBack && (
              <CustomPressable onPress={navigateToProfile}>
                <SVG source={chevronSVG} height={24} width={24} />
              </CustomPressable>
            )}
            <BrandText style={[fontSemibold18, { lineHeight: 0 }]}>
              {title || "Settings"}
            </BrandText>

            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} height={24} width={24} />
            </CustomPressable>
          </View>
        )}

        <WrapperComponent {...wrapperComponentProps}>
          {children}
        </WrapperComponent>
      </Animated.View>
    </SafeAreaView>
  );
};
