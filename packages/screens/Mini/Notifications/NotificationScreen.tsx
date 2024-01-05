import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, View } from "react-native";

import { NotificationHeader } from "./NotificationHeader";
import NotificationList from "./NotificationList";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { RootStackParamList } from "../../../utils/navigation";

type NotificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Notifications">;
};

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
      headerMini={<NotificationHeader navigation={navigation} />}
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
