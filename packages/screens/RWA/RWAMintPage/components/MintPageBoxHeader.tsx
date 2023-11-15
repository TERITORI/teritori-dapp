import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { Separator } from "../../../../components/Separator";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useTheme } from "../../../../hooks/useTheme";
import { fontSemibold14 } from "../../../../utils/style/fonts";

type MintPageBoxHeaderProps = { title: string; children: React.ReactNode };

export const MintPageBoxHeader: React.FC<MintPageBoxHeaderProps> = ({
  title,
  children,
}) => {
  const theme = useTheme();
  return (
    <TertiaryBox
      fullWidth
      style={{ marginTop: 20 }}
      mainContainerStyle={{
        backgroundColor: theme.headerBackgroundColor,
        borderColor: theme.borderColor,
        alignItems: "flex-start",
      }}
      squaresBackgroundColor={theme.backgroundColor}
    >
      <View style={{ padding: 15 }}>
        <BrandText style={fontSemibold14}>{title}</BrandText>
      </View>
      <Separator style={{ marginBottom: 12 }} color={theme.borderColor} />
      {children}
    </TertiaryBox>
  );
};
