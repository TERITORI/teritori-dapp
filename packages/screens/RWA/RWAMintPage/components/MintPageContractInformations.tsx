import { View, ViewStyle } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { ProgressionCardWithoutBox } from "../../../../components/cards/ProgressionCard";
import { Separator } from "../../../../components/separators/Separator";
import { useTheme } from "../../../../hooks/useTheme";

type MintPageContractInformationProps = {
  label: string;
  value: string;
  style?: ViewStyle;
  contractAddress?: string;
};

const MintPageContractInformation: React.FC<
  MintPageContractInformationProps
> = ({ label, value, style, contractAddress }) => {
  const theme = useTheme();
  return (
    <View style={[style, { flexDirection: "column" }]}>
      <BrandText
        style={{
          fontSize: 12,
          fontWeight: "300",
          letterSpacing: -1,
        }}
      >
        {label}
      </BrandText>
      <BrandText
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: "200",
          letterSpacing: -1,
          color: theme.primaryButtonColor,
        }}
      >
        {value}
      </BrandText>
    </View>
  );
};

export const MintPageContractInformations: React.FC = () => {
  const theme = useTheme();
  return (
    <TertiaryBox
      style={{ marginTop: 30 }}
      mainContainerStyle={{
        backgroundColor: theme.headerBackgroundColor,
        borderColor: theme.borderColor,
        padding: 15,
      }}
      width={420}
      squaresBackgroundColor={theme.backgroundColor}
    >
      <View style={{ width: "100%" }}>
        <View style={{ flexDirection: "row" }}>
          <MintPageContractInformation
            label="Contract Address"
            value="0xf928d"
          />
          <MintPageContractInformation
            style={{ marginLeft: 42 }}
            label="Token Standard"
            value="ERC-721"
          />
          <MintPageContractInformation
            style={{ marginLeft: 42 }}
            label="Blockchain"
            value="Arbitrum One"
          />
        </View>
        <Separator style={{ marginVertical: 15 }} color={theme.borderColor} />
        <ProgressionCardWithoutBox
          label="Minted Tokens"
          valueCurrent={1294}
          valueMax={1732}
        />
      </View>
    </TertiaryBox>
  );
};
