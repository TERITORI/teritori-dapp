import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../../../components/BrandText";
import { Separator } from "../../../../../components/separators/Separator";
import { useTheme } from "../../../../../hooks/useTheme";
import { neutral77 } from "../../../../../utils/style/colors";
import { fontSemibold12 } from "../../../../../utils/style/fonts";
import { MintPageBoxHeader } from "../MintPageBoxHeader";

export type MintPageTabsBoxRowProps = {
  label: string;
  value: string;
  isDocument?: boolean;
  isLastElement?: boolean;
};

export const MintPageTabsBoxRow: React.FC<MintPageTabsBoxRowProps> = ({
  label,
  value,
  isDocument,
  isLastElement = false,
}) => {
  const theme = useTheme();
  return (
    <View style={{ width: "100%", paddingHorizontal: 15 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText
          style={[fontSemibold12, { fontWeight: "300", color: neutral77 }]}
        >
          {label}
        </BrandText>
        <TouchableOpacity disabled={!isDocument}>
          <BrandText
            style={[
              fontSemibold12,
              {
                fontWeight: "300",
                color: isDocument ? theme.primaryButtonColor : theme.textColor,
              },
            ]}
          >
            {value}
          </BrandText>
        </TouchableOpacity>
      </View>
      {!isLastElement ? (
        <Separator style={{ marginVertical: 12 }} color={theme.borderColor} />
      ) : (
        <View style={{ marginBottom: 12 }} />
      )}
    </View>
  );
};

type MintPageTabsBoxProps = { title: string; rows: MintPageTabsBoxRowProps[] };

export const MintPageTabsBox: React.FC<MintPageTabsBoxProps> = ({
  title,
  rows,
}) => {
  return (
    <MintPageBoxHeader title={title}>
      {rows.map((row, index) => (
        <MintPageTabsBoxRow
          {...row}
          isLastElement={index === rows.length - 1}
        />
      ))}
    </MintPageBoxHeader>
  );
};
