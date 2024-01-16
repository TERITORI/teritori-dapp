import { useState } from "react";
import { Dimensions, View } from "react-native";

import NotificationList from "./NotificationList";
import DropdownWithCheck from "./components/DropdownWithCheck";
import MiniHeader from "./components/MiniHeader";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { ScreenFC } from "../../../utils/navigation";
import { fontSemibold18 } from "../../../utils/style/fonts";

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
  const [filterOptions, setFilterOptions] = useState<any>([]);

  console.log(filterOptions);

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
          width: Dimensions.get("window").width,
        }}
      >
        <NotificationList />
      </View>
    </ScreenContainer>
  );
};

export default NotificationScreen;
