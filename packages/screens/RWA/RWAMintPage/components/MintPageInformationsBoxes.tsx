import { View } from "react-native";

import { EstateCardInformationBox } from "../../components/EstateCard/EstateCardInformations";

export const MintPageInformationsBoxes: React.FC = () => {
  return (
    <View
      style={{
        margin: -6,
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox
          secondary
          label="Total Investment"
          value="96,600 USDC"
        />
      </View>
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox secondary label="Target APY" value="11.39%" />
      </View>
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox
          secondary
          label="Target ROI per Token"
          value="5.69 USDC"
        />
      </View>
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox
          secondary
          label="Token Supply"
          value="1,932"
        />
      </View>
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox
          secondary
          label="Token Price"
          value="50 USDC"
        />
      </View>
      <View style={{ margin: 6 }}>
        <EstateCardInformationBox
          secondary
          label="Max Token Buy"
          value="50 by address"
        />
      </View>
    </View>
  );
};
