import { useMemo, useState } from "react";
import { SectionList, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import ListView from "../Mini/components/ListView";
import MiniTextInput from "../Mini/components/MiniTextInput";

import teritoriSVG from "@/assets/icons/networks/teritori.svg";
import searchSVG from "@/assets/icons/search-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerRow } from "@/components/spacer";
import { selectAvailableApps } from "@/store/slices/dapps-store";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral00,
  neutral22,
  neutral76,
  withAlpha,
} from "@/utils/style/colors";
import { fontSemibold14, fontSemibold18 } from "@/utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "@/utils/style/layout";
import { dAppType } from "@/utils/types/dapp-store";

const browserRoutes = [
  {
    routeName: "TNSHome",
    route: "tns",
  },
  {
    routeName: "NativeWallet",
    route: "wallet-manager",
  },
  {
    routeName: "Organizations",
    route: "orgs",
  },
  {
    routeName: "ToriPunks",
    route: "dapp/tori-punks/welcome",
  },
];

function WebViewHeader({
  searchInput,
  onChange,
  hasNoDapps,
}: {
  searchInput: string;
  onChange: (text: string) => void;
  hasNoDapps: boolean;
}) {
  const navigation = useAppNavigation();

  function onSubmit() {
    if (hasNoDapps) {
      const urlPattern: RegExp =
        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
      if (urlPattern.test(searchInput)) {
        const url =
          searchInput.search("https") !== -1
            ? searchInput
            : "https://" + searchInput;
        navigation.navigate("BrowserDetail", {
          root: url,
          path: "",
        });
      } else {
        navigation.navigate("BrowserDetail", {
          root: "https://google.com/search",
          path: `?q=${searchInput}`,
        });
      }
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
      }}
    >
      <View style={{ width: "100%" }}>
        <MiniTextInput
          icon={searchSVG}
          placeholder="Search dApps or internet..."
          onChangeText={onChange}
          returnKeyType="search"
          autoCapitalize="none"
          onSubmitEditing={onSubmit}
          style={{
            paddingHorizontal: layout.spacing_x1_5,
            paddingVertical: layout.spacing_x1,
            backgroundColor: withAlpha(neutral76, 0.24),
            borderRadius: layout.spacing_x1_25,
          }}
          inputStyle={{
            lineHeight: layout.spacing_x2,
          }}
        />
      </View>
    </View>
  );
}

export const BrowserScreen: ScreenFC<"Browser"> = () => {
  const [searchInput, setSearchInput] = useState("");
  const availableApps = useSelector(selectAvailableApps);
  const [showDapps, setShowDapps] = useState(false);
  const { width } = useWindowDimensions();

  const filteredApps = useMemo(filterDapps, [
    searchInput,
    availableApps,
    showDapps,
  ]);

  function filterDapps() {
    if (showDapps) {
      return Object.values(availableApps).map((element) => {
        return {
          title: element.groupName,
          icon: element.icon,
          data: Object.values(element.options).filter((option: dAppType) => {
            return option.title
              .toLowerCase()
              .includes(searchInput.toLowerCase());
          }),
        };
      });
    }

    return [];
  }

  const hasNoDapps = useMemo(() => {
    return filteredApps
      .map((item) => {
        if (item.data.length > 0) {
          return "true";
        }

        return "false";
      })
      .every((cur) => cur !== "true");
  }, [filteredApps]);

  function changeHandler(text: string) {
    setSearchInput(text);
    if (!text) {
      setShowDapps(false);
    } else {
      setShowDapps(true);
    }
  }

  return (
    <ScreenContainer
      headerMini={
        <WebViewHeader
          onChange={changeHandler}
          hasNoDapps={hasNoDapps}
          searchInput={searchInput}
        />
      }
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle=""
    >
      <View
        style={{
          flex: 1,
          width,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <SectionList
          sections={filteredApps}
          keyExtractor={(item, index) => item.groupKey + index}
          renderItem={({ item: option, index }) => (
            <SearchedItem key={index} option={option} />
          )}
          renderSectionHeader={({ section: { title, icon } }) => {
            if (hasNoDapps) {
              return null;
            }

            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: layout.spacing_x1_5,
                  marginBottom: layout.spacing_x2,
                  marginTop: layout.spacing_x3_5,
                  paddingBottom: layout.spacing_x2_5,
                  borderBottomWidth: 2,
                  borderBottomColor: neutral22,
                }}
              >
                <SVGorImageIcon
                  icon={teritoriSVG}
                  iconSize={24}
                  style={{
                    marginRight: layout.spacing_x1_5,
                  }}
                />
                <BrandText style={fontSemibold18}>{title}</BrandText>
              </View>
            );
          }}
          stickySectionHeadersEnabled={false}
        />
      </View>
    </ScreenContainer>
  );
};

function SearchedItem({ option }: { option: dAppType }) {
  const navigation = useAppNavigation();

  return (
    <ListView
      onPress={() => {
        if (option.route.toLowerCase() === "external" && option.url) {
          navigation.navigate("BrowserDetail", { root: option.url, path: "" });
        } else {
          const nativeRoute = browserRoutes.filter(
            (route) => route.routeName === option.route,
          )?.[0]?.route;
          navigation.navigate("BrowserDetail", {
            root: "https://app.teritori.com/",
            path: nativeRoute ?? option.route.toLowerCase(),
          });
        }
      }}
      style={{
        paddingHorizontal: layout.spacing_x1_5,
      }}
      options={{
        label: option?.title,
        labelStyle: {
          fontSize: 14,
        },
        leftIconEnabled: true,
        leftIconOptions: {
          component: (
            <>
              <SVGorImageIcon icon={option.icon} iconSize={18} />
              <SpacerRow size={1.5} />
            </>
          ),
        },
        iconEnabled: true,
      }}
    />
  );
}
