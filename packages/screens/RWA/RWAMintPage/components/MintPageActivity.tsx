import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { Separator } from "../../../../components/Separator";
import { TertiaryBadge } from "../../../../components/badges/TertiaryBadge";
import { GradientText } from "../../../../components/gradientText";
import { useIsLightTheme, useTheme } from "../../../../hooks/useTheme";
import { neutral77, yellowDefault } from "../../../../utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "../../../../utils/style/fonts";

export const MintPageActivity: React.FC = () => {
  const isLightTheme = useIsLightTheme();
  const theme = useTheme();
  return (
    <View style={{ marginTop: 50 }}>
      <BrandText style={[fontSemibold20, { marginBottom: 30 }]}>
        Activity
      </BrandText>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TertiaryBadge
          label="Private Sale"
          textStyle={{ color: theme.textColor }}
        />
        {isLightTheme ? (
          <GradientText gradientType="red" style={fontSemibold16}>
            ENDED
          </GradientText>
        ) : (
          <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
            ENDED
          </BrandText>
        )}
      </View>
      <View style={{ marginTop: 20, flexDirection: "row" }}>
        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          Whitelist
        </BrandText>
        <BrandText style={[fontSemibold16, { marginLeft: 5 }]}>953</BrandText>
        <BrandText
          style={[
            fontSemibold16,
            { color: neutral77, marginHorizontal: 7, top: -4 },
          ]}
        >
          .
        </BrandText>
        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          Max
        </BrandText>

        <BrandText style={[fontSemibold16, { marginLeft: 5 }]}>10</BrandText>
        <BrandText
          style={[fontSemibold16, { color: neutral77, marginLeft: 5 }]}
        >
          Tokens
        </BrandText>
      </View>

      <Separator style={{ marginVertical: 20 }} color={theme.borderColor} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TertiaryBadge
          label="Public Sale"
          textStyle={{ color: theme.textColor }}
        />
        {isLightTheme ? (
          <GradientText gradientType="green" style={fontSemibold16}>
            IN PROGRESS
          </GradientText>
        ) : (
          <BrandText
            style={[fontSemibold16, { color: theme.primaryButtonColor }]}
          >
            IN PROGRESS
          </BrandText>
        )}
      </View>
      <Separator style={{ marginVertical: 20 }} color={theme.borderColor} />
    </View>
  );
};
