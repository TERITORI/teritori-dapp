import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { Dropdown } from "../../../components/Dropdown";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { secondaryColor } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { CustomButton } from "../components/CustomButton";
import RowDisplay from "../components/RowDisplay";

const SendingToriScreen: ScreenFC<"MiniSendingTori"> = ({ navigation }) => {
  const goBackTo = () =>
    navigation.replace("MiniSendTori", { back: "MiniSendingTori" });

  return (
    <BlurScreenContainer title="Sending TORI" onGoBack={goBackTo}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          justifyContent: "space-between",
        }}
      >
        <View>
          <SpacerColumn size={3} />
          <RowDisplay
            leftLabel={
              <SVG source={teritoriCircleSVG} width={28} height={28} />
            }
            rightLabel="2000 TORI"
          />

          <SpacerColumn size={2} />

          <Dropdown
            positionStyle={{ width: "100%", top: 45 }}
            triggerComponent={
              <View style={{ alignItems: "center" }}>
                <SVG source={chevronDownSVG} width={28} height={28} />
              </View>
            }
          >
            <View style={{ flex: 1 }}>
              <RowDisplay
                leftLabel="g10nz0wchvkkj7rr09vcxj5rpt2mfdj056yd2ehvnd"
                leftLabelStyle={{ color: secondaryColor }}
              />
              <SpacerColumn size={1.5} />
              <RowDisplay
                leftLabel="Network Fee"
                rightLabel="0.0000001 TORI"
                rightLabelStyle={fontMedium16}
              />
            </View>
          </Dropdown>
        </View>
        <CustomButton title="Send" onPress={() => navigation.goBack()} />
      </View>
    </BlurScreenContainer>
  );
};

export default SendingToriScreen;
