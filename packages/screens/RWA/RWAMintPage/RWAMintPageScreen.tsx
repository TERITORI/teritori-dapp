import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ProgressionCardWithoutBox } from "../../../components/cards/ProgressionCard";
import { setIsLightTheme } from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { EstateCardTags } from "../components/EstateCard/EstateCard";
import { EstateCardInformationBox } from "../components/EstateCard/EstateCardInformations";
import { getEstateCardById } from "../components/EstateCard/EstateCardList";
import { RWAScreenContainer } from "../components/RWAScreenContainer/RWAScreenContainer";

export const RWAMintPageScreen: ScreenFC<"RWAMintPage"> = ({
  route: {
    params: { id },
  },
}) => {
  const dispatch = useAppDispatch();
  const { goBack } = useAppNavigation();
  const { tags, card } = getEstateCardById(id);

  React.useEffect(() => {
    dispatch(setIsLightTheme(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RWAScreenContainer onBackPress={goBack} headerTitle={card.title}>
      <View
        style={{
          marginHorizontal: 115,
          marginTop: 50,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 10, borderColor: "blue", borderWidth: 1 }}>
          <EstateCardTags tags={tags} />
          <BrandText
            style={{
              fontSize: 28,
              letterSpacing: -2,
              fontWeight: "300",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {card.title}
          </BrandText>
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
              <EstateCardInformationBox
                secondary
                label="Target APY"
                value="11.39%"
              />
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
          <ProgressionCardWithoutBox
            label="Minted Tokens"
            valueCurrent={1294}
            valueMax={1732}
          />
        </View>
        <View style={{ flex: 4 }} />
        <View style={{ flex: 10, borderWidth: 1, borderColor: "red" }}>
          <EstateCardTags tags={tags} />
          <BrandText
            style={{ fontSize: 28, letterSpacing: -2, fontWeight: "300" }}
          >
            {card.title}
          </BrandText>
        </View>
      </View>
    </RWAScreenContainer>
  );
};
