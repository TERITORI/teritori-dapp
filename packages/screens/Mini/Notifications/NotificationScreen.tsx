import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import NotificationList from "./NotificationList";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import DropdownWithCheck from "../components/Dropdown/DropdownWithCheck";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  selectNotificationList,
  selectTotalNotification,
} from "@/store/slices/notification";
import { ScreenFC } from "@/utils/navigation";
import { fontSemibold18 } from "@/utils/style/fonts";

const filterOptionsConst = [
  {
    value: "all",
    name: "All",
    isChecked: true,
  },
  {
    value: "nft_sales",
    name: "NFT sales",
    isChecked: true,
  },
  {
    value: "announcements",
    name: "Announcements",
    isChecked: true,
  },
  {
    value: "news",
    name: "News",
    isChecked: true,
  },
  {
    value: "tranactions",
    name: "Tranactions",
    isChecked: true,
  },
  {
    value: "tips",
    name: "Tips",
    isChecked: true,
  },
];

const NotificationScreen: ScreenFC<"Notifications"> = ({ navigation }) => {
  const [, setFilterOptions] = useState<any>([]);
  const notifications = useSelector(selectNotificationList);
  const notificaitonCount = useSelector(selectTotalNotification);
  console.log(notifications);
  console.log(notificaitonCount);

  const { width: windowWidth } = useWindowDimensions();

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={
        <CustomAppBar
          left={<BrandText style={fontSemibold18}>Notifications</BrandText>}
          backEnabled
          right={
            <DropdownWithCheck
              filterOptions={filterOptionsConst}
              headerOptions={{ name: "Filters" }}
              onPress={(selectedItems) => setFilterOptions(selectedItems)}
            />
          }
        />
      }
    >
      <View
        style={{
          flex: 1,
          width: windowWidth,
        }}
      >
        <NotificationList notifications={notifications} />
      </View>
    </ScreenContainer>
  );
};

export default NotificationScreen;
