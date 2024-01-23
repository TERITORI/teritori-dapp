import { FlatList } from "react-native";

import questionSVG from "../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { useBalances } from "../../../hooks/useBalances";
import { prettyPrice } from "../../../utils/coins";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { findByBaseDenom } from "../../Wallet/util/chain-registry";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import ListView from "../components/ListView";

const SelectTokenScreen: ScreenFC<"MiniSelectToken"> = ({
  navigation,
  route,
}) => {
  const { navigateTo } = route.params;
  const networkId = "teritori";
  const balances = useBalances(
    networkId,
    "tori1lkydvh2qae4gqdslmwaxrje7j57p2kq8dw9d7t",
  );

  const assets = balances.map((balance) => {
    const assetList = findByBaseDenom(balance.denom);
    return {
      ...balance,
      ...assetList?.assets[0],
    };
  });

  return (
    <BlurScreenContainer title="Select Token">
      {!assets.length ? (
        <BrandText
          style={[
            fontNormal15,
            {
              color: neutralA3,
              paddingTop: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x1_5,
            },
          ]}
        >
          No Tokens to Display
        </BrandText>
      ) : (
        <FlatList
          inverted
          data={assets}
          keyExtractor={(item) => item.denom}
          renderItem={({ item }) => (
            <ListView
              onPress={() =>
                navigation.replace(navigateTo, {
                  back: "MiniSelectToken",
                })
              }
              style={{
                paddingHorizontal: layout.spacing_x2,
              }}
              options={{
                leftIconEnabled: true,
                leftIconOptions: {
                  icon: item.logo_URIs?.svg || questionSVG,
                },
                label: item?.symbol,
                rightLabel: prettyPrice(networkId, item.amount, item.denom),
                iconOptions: { iconStyle: { marginLeft: 10 } },
              }}
            />
          )}
        />
      )}
    </BlurScreenContainer>
  );
};

export default SelectTokenScreen;
