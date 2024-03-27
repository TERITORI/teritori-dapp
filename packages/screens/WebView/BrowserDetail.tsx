import { useRef, useState } from "react";
import { ImageStyle, StyleProp, View, useWindowDimensions } from "react-native";
import { SvgProps } from "react-native-svg";
import WebView from "react-native-webview";

import backSVG from "@/assets/icons/back.svg";
import lockSVG from "@/assets/icons/marketplace-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Spinner } from "@/components/Spinner";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { ScreenFC } from "@/utils/navigation";
import { neutral00, neutral77, secondaryColor } from "@/utils/style/colors";
import { fontMedium10, fontSemibold12 } from "@/utils/style/fonts";
import {
  MOBILE_FOOTER_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  layout,
} from "@/utils/style/layout";

function BrowserHeader({ url }: { url: string }) {
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
      }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <SVG source={lockSVG} width={25} height={25} />
          <BrandText style={fontSemibold12}>
            {url.length > 40 ? url.substring(0, 40) + "..." : url}
          </BrandText>
        </View>
      </View>
    </View>
  );
}

function BrowserFooter({
  browserNav,
  reload,
  goBack,
  goForward,
  goHome,
}: {
  browserNav: BrowserNavigationType;
  reload: () => void;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
}) {
  const bottomTabs = [
    {
      name: "back",
      icon: backSVG,
      onPress: goBack,
      disabled: !browserNav.canGoBack,
    },
    {
      name: "forward",
      icon: backSVG,
      onPress: goForward,
      style: { transform: [{ rotate: "180deg" }] },
      disabled: !browserNav.canGoForward,
    },
    {
      name: "home",
      icon: lockSVG,
      onPress: goHome,
    },
    {
      name: "reload",
      icon: lockSVG,
      onPress: reload,
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
  const [initUrl, setInitUrl] = useState(params.root + params.path ?? "");
  const [browserNav, setBrowserNav] = useState<BrowserNavigationType>({
    canGoBack: false,
    canGoForward: false,
    url: params.root + params.path ?? "",
  });

  const webViewRef = useRef<WebView>(null);

  const reloadBrowser = () => {
    if (!webViewRef.current) {
      return;
    }
    webViewRef.current.reload();
  };

  const goForward = () => {
    if (!webViewRef.current) {
      return;
    }
    webViewRef.current.goForward();
  };

  const goBack = () => {
    if (!webViewRef.current) {
      return;
    }
    webViewRef.current.goBack();
  };

  const goHome = () => {
    setInitUrl(params.root);
  };

  return (
    <ScreenContainer
      headerMini={<BrowserHeader url={browserNav.url} />}
      responsive
      fullWidth
      footerChildren={
        <BrowserFooter
          reload={reloadBrowser}
          goForward={goForward}
          goBack={goBack}
          browserNav={browserNav}
          goHome={goHome}
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
          source={{ uri: initUrl }}
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
      <SVGorImageIcon icon={icon} iconSize={iconSize ?? 22} style={style} />
      {name && (
        <BrandText
          style={[
            fontMedium10,
            { color: disabled ? neutral77 : secondaryColor },
          ]}
        >
          {name}
        </BrandText>
      )}
    </CustomPressable>
  );
}
