import { View, useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { DAppStoreMenuItem } from "../Mini/DAppStore/component/DAppStoreMenuItems";
import MiniTextInput from "../Mini/components/MiniTextInput";

import { ScreenContainer } from "@/components/ScreenContainer";
import { selectAvailableApps } from "@/store/slices/dapps-store";
import { ScreenFC } from "@/utils/navigation";
import { neutral00 } from "@/utils/style/colors";
import { MOBILE_HEADER_HEIGHT, layout } from "@/utils/style/layout";
import { dAppType } from "@/utils/types/dapp-store";

function WebViewHeader({ onChange }: { onChange: (text: string) => void }) {
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
      <View style={{ flex: 1, marginVertical: layout.spacing_x1_5 }}>
        <MiniTextInput placeholder="Search Dapps" onChangeText={onChange} />
      </View>
    </View>
  );
}

export const BrowserScreen: ScreenFC<"Browser"> = ({ navigation }) => {
  const availableApps = useSelector(selectAvailableApps);
  const coreDApps = availableApps["teritori-core-apps"];
  const { width } = useWindowDimensions();
  const topApps = availableApps["top-apps"];

  const alwaysOnApps: dAppType[] = Object.values(coreDApps.options)
    .concat(Object.values(topApps.options))
    .filter((x: dAppType) => x.alwaysOn);

  console.log("always on apps: ", alwaysOnApps);

  function changeHandler(text: string) {
    console.log(text);
  }

  return (
    <ScreenContainer
      headerMini={<WebViewHeader onChange={changeHandler} />}
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
        <FlatList
          data={alwaysOnApps}
          renderItem={({ item, index }) => {
            return (
              <DAppStoreMenuItem
                icon={item.icon}
                title={item.title}
                isAdded
                onPress={() => {
                  navigation.navigate("BrowserDetail", {
                    path: "marketplace",
                  });
                }}
              />
            );
          }}
          keyExtractor={(item, idx) => `${item?.title}-${idx}`}
        />
      </View>
    </ScreenContainer>
  );
};
