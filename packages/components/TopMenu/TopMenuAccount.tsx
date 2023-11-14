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

export const TopMenuAccount: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  return (
    <FlexCol style={containerCStyle}>
      <UserNameInline
        userId={selectedWallet?.userId || ""}
        style={userImageLineCStyle}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        <OmniLink to={{ screen: "WalletManagerWallets" }}>
          <FlexRow alignItems="center">
            <BrandText style={switchAccountCStyle}>Change Wallet</BrandText>
            <SVG source={chevronRightSVG} width={16} height={16} />
          </FlexRow>
        </OmniLink>

        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: selectedWallet?.userId || "" },
          }}
        >
          <BrandText style={manageProfileCStyle}>Manage Profile</BrandText>
        </OmniLink>
      </FlexRow>
    </FlexCol>
  );
};

const containerCStyle: ViewStyle = {
  padding: layout.spacing_x2,
};

const userImageLineCStyle: ViewStyle = {
  width: "100%",
  marginBottom: layout.spacing_x1_5,
};

const switchAccountCStyle: TextStyle = {
  ...fontSemibold14,
  marginRight: layout.spacing_x0_5,
};

const manageProfileCStyle: TextStyle = {
  ...fontSemibold14,
  color: purpleLight,
};
