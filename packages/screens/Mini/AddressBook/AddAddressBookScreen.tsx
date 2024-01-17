import { View } from "react-native";

import addSVG from "../../../../assets/icons/add-circle-outline.svg";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import { CustomButton } from "../components/CustomButton";
import MiniTextInput from "../components/MiniTextInput";

const AddAddressBookScreen: ScreenFC<"AddAddressBook"> = ({ navigation }) => {
  const goBackTo = () =>
    navigation.replace("AddressBook", { back: "AddAddressBook" });

  return (
    <BlurScreenContainer title="Add Address" onGoBack={goBackTo}>
      <SpacerColumn size={2} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <CircularImgOrIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={addSVG}
        />
      </View>
      <SpacerColumn size={4} />
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <MiniTextInput placeholder="Label" />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="Address" />
        </View>

        <CustomButton onPress={() => {}} title="Add" />
      </View>
    </BlurScreenContainer>
  );
};

export default AddAddressBookScreen;
