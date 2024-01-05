import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, View } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { RootStackParamList } from "../../../utils/navigation";
import MiniHeader from "../Notifications/components/MiniHeader";

type AddressBookScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddressBook">;
};

export default function AddressBookScreen({
  navigation,
}: AddressBookScreenProps) {
  const onClose = () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");
  };

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
          backEnabled
          title="Add Address"
          right={
            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} width={24} height={24} />
            </CustomPressable>
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
        <BrandText>Address Book</BrandText>
      </View>
    </ScreenContainer>
  );
}
