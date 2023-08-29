import { TextStyle, ViewStyle } from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { purpleLight } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { UserNameInline } from "../UserNameInline";
import { CustomPressable } from "../buttons/CustomPressable";

export const TopMenuAccount: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  return (
    <FlexCol style={containerStyle}>
      <UserNameInline
        userId={selectedWallet?.userId || ""}
        style={userImageLineStyle}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        {/*TODO: Replace CustomPressable by TouchableOpacity when the Multisig feature is available*/}
        <CustomPressable>
          {({ hovered }) => (
            <FlexRow alignItems="center">
              <BrandText style={switchAccountStyle}>
                {hovered ? "Coming Soon" : "Switch Account"}
              </BrandText>
              <SVG source={chevronRightSVG} width={16} height={16} />
            </FlexRow>
          )}
        </CustomPressable>

        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: selectedWallet?.userId || "" },
          }}
        >
          <BrandText style={manageProfileStyle}>Manage Profile</BrandText>
        </OmniLink>
      </FlexRow>
    </FlexCol>
  );
};

const containerStyle: ViewStyle = {
  padding: layout.padding_x2,
};
const userImageLineStyle: ViewStyle = {
  width: "100%",
  marginBottom: layout.padding_x1_5,
};
const switchAccountStyle: TextStyle = {
  ...fontSemibold14,
  marginRight: layout.padding_x0_5,
};
const manageProfileStyle: TextStyle = {
  ...fontSemibold14,
  color: purpleLight,
};
