import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

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

export const TopMenuAccount: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const [hovered, setHovered] = useState(false);

  return (
    <FlexCol style={styles.container}>
      <UserNameInline
        userId={selectedWallet?.userId || ""}
        style={styles.userImageLine}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        {/*TODO: Replace Pressable by TouchableOpacity when the Multisig feature is available*/}
        <Pressable
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
        >
          <FlexRow alignItems="center">
            <BrandText style={styles.switchAccount}>
              {hovered ? "Coming Soon" : "Switch Account"}
            </BrandText>
            <SVG source={chevronRightSVG} width={16} height={16} />
          </FlexRow>
        </Pressable>

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
