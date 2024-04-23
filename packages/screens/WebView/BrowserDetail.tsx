import { useRef, useState } from "react";
import {
  ImageStyle,
  Linking,
  Share,
  StyleProp,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgProps } from "react-native-svg";
import WebView from "react-native-webview";

import browseSVG from "@/assets/icons/browse-gray.svg";
import closeSVG from "@/assets/icons/close.svg";
import dotSVG from "@/assets/icons/dots.svg";
import backSVG from "@/assets/icons/forward.svg";
import lockSVG from "@/assets/icons/lock-solid-gray.svg";
import reloadSVG from "@/assets/icons/reload.svg";
import sendSVG from "@/assets/icons/sent-white.svg";
import shareSVG from "@/assets/icons/share-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Spinner } from "@/components/Spinner";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { DropdownWithListItem } from "@/components/mini/DropdownWithListItem";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral00, neutral22, neutralA3 } from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";
import {
  MOBILE_FOOTER_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  layout,
} from "@/utils/style/layout";

function BrowserHeader({
  url,
  shareLink,
}: {
  url: string;
  shareLink: () => void;
}) {
  const navigation = useAppNavigation();
  const { setToast } = useFeedbacks();

  async function openInBrowser() {
    try {
      const isSupported = await Linking.canOpenURL(url);

      if (isSupported) {
        Linking.openURL(url);
      } else {
        setToast({
          mode: "mini",
          type: "error",
          variant: "solid",
          message: "Error: Link is not valid",
        });
      }
    } catch (error) {
      setToast({
        mode: "mini",
        type: "error",
        variant: "solid",
        message: "Error: " + error,
      });
    }
  }
  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x2,
        position: "absolute",
        top: 0,
        zIndex: 9999,
        borderBottomWidth: 1,
        borderColor: neutral22,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <CustomPressable onPress={() => navigation.goBack()}>
          <SVG source={closeSVG} width={28} height={28} />
        </CustomPressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BrandText
            style={[fontSemibold14, { marginTop: 8, marginBottom: -10 }]}
          >
            Popular Collections
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flex: 1,
            }}
          >
            <SVG source={lockSVG} width={12} height={12} />
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {url.length > 40 ? url.substring(0, 30) + "..." : url}
            </BrandText>
          </View>
        </View>
        <DropdownWithListItem
          items={[
            {
              onPress: openInBrowser,
              name: "Open in browser",
              icon: browseSVG,
            },
            {
              onPress: shareLink,
              name: "Share the link",
              icon: shareSVG,
            },
          ]}
          iconSize={34}
          icon={dotSVG}
        />
      </View>
    </View>
  );
}

function BrowserFooter({
  browserNav,
  webViewRef,
  shareLink,
}: {
  browserNav: BrowserNavigationType;
  webViewRef: WebView | null;
  shareLink: () => void;
}) {
  const bottomTabs = [
    {
      name: "back",
      icon: backSVG,
      onPress: () => webViewRef?.goBack(),
      style: { transform: [{ rotate: "180deg" }] },
      disabled: !browserNav.canGoForward,
    },
    {
      name: "forward",
      icon: backSVG,
      onPress: () => webViewRef?.goForward(),
      disabled: !browserNav.canGoBack,
    },
    {
      name: "send",
      icon: sendSVG,
      iconSize: 28,
      onPress: shareLink,
    },
    {
      name: "reload",
      icon: reloadSVG,
      iconSize: 28,
      onPress: () => webViewRef?.reload(),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        height: MOBILE_FOOTER_HEIGHT,
        maxHeight: MOBILE_FOOTER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x2,
        position: "absolute",
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {bottomTabs.map((tabItem, index) => {
          return <BottomTab key={tabItem.name + index} {...tabItem} />;
        })}
      </View>
    </View>
  );
}

type BrowserNavigationType = {
  canGoBack: boolean;
  canGoForward: boolean;
  url: string;
};

export const BrowserDetail: ScreenFC<"BrowserDetail"> = ({ route }) => {
  const { width, height } = useWindowDimensions();
  const { params } = route;
  const [browserNav, setBrowserNav] = useState<BrowserNavigationType>({
    canGoBack: false,
    canGoForward: false,
    url: params.root + params.path ?? "",
  });
  const { setToast } = useFeedbacks();

  const webViewRef = useRef<WebView>(null);

  async function shareLink() {
    try {
      await Share.share({
        message: browserNav.url,
      });
    } catch (error) {
      setToast({
        mode: "mini",
        type: "error",
        variant: "solid",
        message: "Error sharing: " + error,
      });
    }
  }

  return (
    <ScreenContainer
      headerMini={<BrowserHeader url={browserNav.url} shareLink={shareLink} />}
      responsive
      fullWidth
      footerChildren={
        <BrowserFooter
          webViewRef={webViewRef.current}
          browserNav={browserNav}
          shareLink={shareLink}
        />
      }
      noScroll
      mobileTitle=""
    >
      <View
        style={{
          flex: 1,
          width,
          paddingHorizontal: layout.spacing_x2,
          backgroundColor: neutral00,
        }}
      >
        <WebView
          source={{ uri: params.root + params.path ?? "" }}
          style={{
            width: "100%",
            maxWidth: width,
            height,
            backgroundColor: neutral00,
          }}
          startInLoadingState
          renderLoading={() => (
            <View
              style={{
                width: "100%",
                maxWidth: width,
                height,
                alignItems: "center",
                marginVertical: layout.spacing_x1_5,
              }}
            >
              <Spinner />
            </View>
          )}
          onNavigationStateChange={(navigation) => {
            const { url, canGoBack, canGoForward } = navigation;

            setBrowserNav((prev) => ({
              ...prev,
              url,
              canGoBack,
              canGoForward,
            }));
          }}
          allowsFullscreenVideo
          ref={webViewRef}
        />
      </View>
    </ScreenContainer>
  );
};

type BottomTabType = {
  onPress: () => void;
  icon: React.FC<SvgProps> | string;
  name?: string;
  disabled?: boolean;
  style?: StyleProp<ImageStyle>;
  iconSize?: number;
};

function BottomTab({
  onPress,
  name,
  icon,
  disabled = false,
  iconSize,
  style,
}: BottomTabType) {
  return (
    <CustomPressable onPress={onPress} style={{ alignItems: "center", gap: 6 }}>
      <SVGorImageIcon icon={icon} iconSize={iconSize ?? 20} style={style} />
    </CustomPressable>
  );
}
