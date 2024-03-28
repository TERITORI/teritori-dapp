import { FlatList } from "react-native";

import questionSVG from "../../../../assets/icons/question-gray.svg";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { useGetAssets } from "@/hooks/wallet/useGetAssets";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC } from "@/utils/navigation";
import { neutralA3 } from "@/utils/style/colors";
import { fontNormal15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const SelectTokenScreen: ScreenFC<"MiniSelectToken"> = ({
  navigation,
  route,
}) => {
  const { navigateTo } = route.params;

  const selectedWallet = useSelectedNativeWallet();

  const assets = useGetAssets(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );

  return (
    <BlurScreenContainer title="Select Token" noScrollView>
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
                  denom: item.denom,
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
                rightLabel: prettyPrice(
                  item.networkId,
                  item.amount,
                  item.denom,
                ),
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
