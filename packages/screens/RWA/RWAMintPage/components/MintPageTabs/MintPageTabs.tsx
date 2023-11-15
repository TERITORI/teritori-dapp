import { useState } from "react";
import { View } from "react-native";

import { MintPageTabsBox, MintPageTabsBoxRowProps } from "./MintPagesTabsBox";
import { ValuationTab } from "./ValuationTab";
import { BrandText } from "../../../../../components/BrandText";
import { Tabs } from "../../../../../components/tabs/Tabs";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { neutral77 } from "../../../../../utils/style/colors";

const tabs = {
  highlights: {
    name: "Highlights",
  },
  description: {
    name: "Description",
  },
  financials: {
    name: "Financials",
  },
  details: {
    name: "Details",
  },
  valuation: {
    name: "Valuation",
  },
};

const highlightsPlaceholder: MintPageTabsBoxRowProps[] = [
  { label: "Property Type", value: "Single Family" },
  { label: "Full Address", value: "7519 Wykes St, Detroit, MI 48210" },
  { label: "Country", value: "USA" },
  { label: "Construction Year", value: "2021" },
  { label: "Bedroom/Bath", value: "3 Beds / 3 Baths" },
  { label: "Rental Type", value: "Long-term" },
  { label: "Rented?", value: "Fully Rented" },
  { label: "Document 1", value: "DIS.pdf", isDocument: true },
  { label: "Document 2", value: "DIS.pdf", isDocument: true },
  { label: "Document 3", value: "DIS.pdf", isDocument: true },
];
const descriptionPlaceholder: string = `This duplex contains two full units with easy access to commuter routes. In addition, this property is close to Laker Park, which reassures the neighbors and mothers living alone with their children. 

Wykes is in the bread and butter category of RealT properties, with an excellent purchase price, low renovations, good tenants, and an attractive cap structured to offer stable rents month after month. 

Below is a breakdown of the renovations:
Exterior: $3, 280.00
Upper Unit(Bathroom): $725.00
Basement area: $495.00`;

export const MintPageTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof tabs>("valuation");
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return (
    <View>
      <Tabs
        borderColorTabSelected={theme.textColor}
        tabContainerStyle={{ height: 50 }}
        tabTextStyle={{ fontWeight: "600", letterSpacing: -0.5 }}
        items={tabs}
        selected={selectedTab}
        onSelect={setSelectedTab}
      />
      {selectedTab === "highlights" && (
        <MintPageTabsBox
          title="Property Highlights"
          rows={highlightsPlaceholder}
        />
      )}
      {selectedTab === "description" && (
        <View style={{ marginTop: 20 }}>
          <BrandText
            style={{
              fontWeight: "400",
              fontSize: 14,
              color: isLightTheme ? neutral77 : theme.textColor,
            }}
          >
            {descriptionPlaceholder}
          </BrandText>
        </View>
      )}
      {selectedTab === "financials" && (
        <MintPageTabsBox
          title="Property Financials"
          rows={highlightsPlaceholder}
        />
      )}
      {selectedTab === "details" && (
        <MintPageTabsBox
          title="Property Details"
          rows={highlightsPlaceholder}
        />
      )}
      {selectedTab === "valuation" && <ValuationTab />}
    </View>
  );
};
