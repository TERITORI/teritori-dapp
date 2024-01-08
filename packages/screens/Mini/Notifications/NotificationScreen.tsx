import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, View } from "react-native";

import NotificationList from "./NotificationList";
import DropdownWithCheck from "./components/DropdownWithCheck";
import MiniHeader from "./components/MiniHeader";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { RootStackParamList } from "../../../utils/navigation";
import { fontSemibold18 } from "../../../utils/style/fonts";

type NotificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Notifications">;
};

const filterOptions = [
  {
    value: "all",
    name: "All",
  },
  {
    value: "nft_sales",
    name: "NFT sales",
  },
  {
    value: "announcements",
    name: "Announcements",
  },
  {
    value: "news",
    name: "News",
  },
  {
    value: "tranactions",
    name: "Tranactions",
  },
  {
    value: "tips",
    name: "Tips",
  },
];

export default function NotificationScreen({
  navigation,
}: NotificationScreenProps) {
  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={
        <MiniHeader
          navigation={navigation}
          left={<BrandText style={fontSemibold18}>Notifications</BrandText>}
          backEnabled
          right={
            <DropdownWithCheck
              filterOptions={filterOptions}
              headerOptions={{ name: "Filters" }}
            />
          }
        />
      }
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
        }}
      >
        <NotificationList />
      </View>
    </ScreenContainer>
  );
}
