import { StyleSheet } from "react-native";

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
    <FlexCol style={styles.container}>
      <UserNameInline
        userId={selectedWallet?.userId || ""}
        style={styles.userImageLine}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        {/*TODO: Replace CustomPressable by TouchableOpacity when the Multisig feature is available*/}
        <CustomPressable>
          {({ hovered }) => (
            <FlexRow alignItems="center">
              <BrandText style={styles.switchAccount}>
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
          <BrandText style={styles.manageProfile}>Manage Profile</BrandText>
        </OmniLink>
      </FlexRow>
    </FlexCol>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    padding: layout.padding_x2,
  },
  userImageLine: {
    width: "100%",
    marginBottom: layout.padding_x1_5,
  },
  switchAccount: {
    ...(fontSemibold14 as object),
    marginRight: layout.padding_x0_5,
  },
  manageProfile: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },
});
