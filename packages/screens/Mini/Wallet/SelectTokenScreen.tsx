import { FlatList } from "react-native";

import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import ListView from "../components/ListView";

export type SelectWalletType = {
  id: string;
  label: string;
  img?: string;
  tori: number;
};

const SelectTokenScreen: ScreenFC<"MiniSelectToken"> = ({
  navigation,
  route,
}) => {
  const { navigateTo } = route.params;
  const addresses: SelectWalletType[] = [
    { id: "asdfdasd", label: "Teritori", img: "", tori: 62424 },
  ];

  return (
    <BlurScreenContainer title="Select Token">
      {!addresses.length ? (
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
          data={addresses.reverse()}
          keyExtractor={(item) => item.id}
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
                  icon: teritoriSVG,
                },
                label: item?.label,
                rightLabel: `${item?.tori.toString()} TORI`,
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
