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
    <FlexCol
      style={{
        padding: layout.spacing_x2,
      }}
    >
      <UserNameInline
        userId={selectedWallet?.userId || ""}
        style={{
          width: "100%",
          marginBottom: layout.spacing_x1_5,
        }}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        {/*TODO: Replace CustomPressable by TouchableOpacity when the Multisig feature is available*/}
        <CustomPressable>
          {({ hovered }) => (
            <FlexRow alignItems="center">
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginRight: layout.spacing_x0_5,
                  },
                ]}
              >
                {hovered ? "Coming Soon" : "Multisig mode"}
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
          <BrandText
            style={[
              fontSemibold14,
              {
                color: purpleLight,
              },
            ]}
          >
            Manage Profile
          </BrandText>
        </OmniLink>
      </FlexRow>
    </FlexCol>
  );
};
