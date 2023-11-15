import { TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "../../../../../components/BrandText";
import { useTheme } from "../../../../../hooks/useTheme";
import { neutralA3 } from "../../../../../utils/style/colors";
import { MintPageBoxHeader } from "../MintPageBoxHeader";

const ValuationTabRowItem: React.FC<{
  topLabel: string;
  topValue: string;
  bottomLabel: string;
  bottomValue: string;
}> = ({ topLabel, topValue, bottomLabel, bottomValue }) => {
  const theme = useTheme();
  return (
    <View
      style={[valuationTabRowItemCStyle, { borderColor: theme.borderColor }]}
    >
      <BrandText numberOfLines={1} style={valuationTabRowLabelCStyle}>
        {topLabel}
      </BrandText>
      <BrandText
        numberOfLines={1}
        style={[valuationTabRowValueCStyle, { color: theme.textColor }]}
      >
        {topValue}
      </BrandText>
      <BrandText numberOfLines={1} style={valuationTabRowLabelCStyle}>
        {bottomLabel}
      </BrandText>
      <BrandText
        numberOfLines={1}
        style={[valuationTabRowValueCStyle, { color: theme.textColor }]}
      >
        {bottomValue}
      </BrandText>
    </View>
  );
};

const ValuationTabRowItemDate: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[valuationTabRowItemCStyle, { borderColor: theme.borderColor }]}
    >
      <BrandText
        style={[
          valuationTabRowValueCStyle,
          { color: theme.textColor, width: 35 },
        ]}
      >
        {value}
      </BrandText>
      <BrandText style={[valuationTabRowLabelCStyle, { width: 75 }]}>
        {label}
      </BrandText>
    </View>
  );
};

const ValuationTabRow: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={[valuationTabRowCStyle, { borderColor: theme.borderColor }]}>
      <ValuationTabRowItemDate
        value="Aug 4 2023"
        label="463 days since prior valuation"
      />
      <ValuationTabRowItem
        topLabel="Asset Valuation"
        topValue="$95,000.00"
        bottomLabel="Annual Change"
        bottomValue="+18,44%"
      />
      <ValuationTabRowItem
        topLabel="Total Investment"
        topValue="96,000.00 USDC"
        bottomLabel="Capital ROI"
        bottomValue="+10,61%"
      />
      <ValuationTabRowItem
        topLabel="Token Price"
        topValue="52.38 USDC"
        bottomLabel="Distributed Yield"
        bottomValue="9,336.67 USDC"
      />
    </View>
  );
};

export const ValuationTab: React.FC = () => {
  return (
    <MintPageBoxHeader title="Property Valuation">
      <View style={{ width: "100%", paddingBottom: 15, paddingHorizontal: 10 }}>
        <ValuationTabRow />
        <View style={{ marginVertical: 5 }} />
        <ValuationTabRow />
      </View>
    </MintPageBoxHeader>
  );
};

const valuationTabRowCStyle: ViewStyle = {
  width: "100%",
  height: 96,
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderRadius: 8,
};

const valuationTabRowItemCStyle: ViewStyle = {
  flex: 1,
  height: "100%",
  borderRightWidth: 1,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const valuationTabRowLabelCStyle: TextStyle = {
  marginTop: 3,
  textAlign: "center",
  color: neutralA3,
  fontSize: 10,
  fontWeight: "300",
};

const valuationTabRowValueCStyle: TextStyle = {
  marginBottom: 3,
  textAlign: "center",
  fontSize: 12,
  fontWeight: "600",
};
