import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { MintPageActivity } from "./components/MintPageActivity";
import { MintPageContractInformations } from "./components/MintPageContractInformations";
import { MintPageEstateImages } from "./components/MintPageEstateImages";
import { MintPageInformationsBoxes } from "./components/MintPageInformationsBoxes";
import { MintPageTabs } from "./components/MintPageTabs/MintPageTabs";
import { LogInBox } from "./components/MintableBox/LogInBox";
import { MintableBox } from "./components/MintableBox/MintableBox";
import { BrandText } from "../../../components/BrandText";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { setIsLightTheme } from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { EstateCardTags } from "../components/EstateCard/EstateCard";
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
  const selectedWallet = useSelectedWallet();

  React.useEffect(() => {
    dispatch(setIsLightTheme(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RWAScreenContainer onBackPress={goBack} headerTitle={card.title}>
      <View style={{ alignItems: "center" }}>
        <View style={containerCStyle}>
          {/* Left section */}
          <View style={[sectionCStyle, { marginRight: 20 }]}>
            {/* Tags */}
            <EstateCardTags tags={tags} />
            <BrandText numberOfLines={1} style={cardTitleCStyle}>
              {card.title}
            </BrandText>
            <View style={{ width: 420 }}>
              <MintPageInformationsBoxes />
              <MintPageContractInformations />
              {/* MintableBox or LogInBox */}
              <View style={{ marginTop: 30 }}>
                {selectedWallet ? (
                  <MintableBox
                    isMintable
                    totalPrice="150 USDC"
                    availableBalance="0"
                    onPressMint={() => {}}
                  />
                ) : (
                  <LogInBox />
                )}
              </View>
              {/* Tabs */}
              <View style={{ marginVertical: 40 }}>
                <MintPageTabs />
              </View>
            </View>
          </View>
          {/* Right section */}
          <View style={[sectionCStyle, { marginLeft: 20 }]}>
            <MintPageEstateImages />
            <MintPageActivity />
          </View>
        </View>
      </View>
    </RWAScreenContainer>
  );
};

const containerCStyle: ViewStyle = {
  marginTop: 50,
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
};

const sectionCStyle: ViewStyle = {
  justifyContent: "flex-start",
  width: "100%",
  maxWidth: 534,
  margin: layout.spacing_x2,
};

const cardTitleCStyle: TextStyle = {
  fontSize: 28,
  letterSpacing: -2,
  fontWeight: "300",
  marginTop: 10,
  marginBottom: 10,
};
