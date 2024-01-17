import { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { BrandText } from "../../../components/BrandText";
import { GridList } from "../../../components/layout/GridList";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useTheme } from "../../../hooks/useTheme";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { EstateCard } from "../components/EstateCard/EstateCard";
import {
  EstateCardListEmpty,
  getEstateCardList,
} from "../components/EstateCard/EstateCardList";
import { RWAScreenContainer } from "../components/RWAScreenContainer/RWAScreenContainer";

const RWA_LIST_AVAILABLE = "Available";
const RWA_LIST_COMING_SOON = "Coming Soon";
const RWA_LIST_SOLD_OUT = "Sold Out";
type RWALists =
  | typeof RWA_LIST_AVAILABLE
  | typeof RWA_LIST_COMING_SOON
  | typeof RWA_LIST_SOLD_OUT;

type RWAListsTabProps = {
  onPress: () => void;
  isSelected: boolean;
  text: RWALists;
};
const RWAListsTab: React.FC<RWAListsTabProps> = ({
  onPress,
  isSelected,
  text,
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={
        isSelected && {
          borderRadius: 100,
          backgroundColor: "#E5E5E8",
          paddingHorizontal: layout.spacing_x1_5,
          paddingVertical: layout.spacing_x0_5,
        }
      }
      onPress={onPress}
    >
      <BrandText
        style={[
          fontSemibold16,
          {
            color: isSelected ? theme.textColor : neutral77,
            fontWeight: "200",
          },
        ]}
      >
        {text}
      </BrandText>
    </TouchableOpacity>
  );
};

export const RWAListsScreen: ScreenFC<"RWALists"> = () => {
  const { goBack } = useAppNavigation();
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState<RWALists>(RWA_LIST_AVAILABLE);
  // After linked to the backend we'll recup lists in function of the selectedTab
  const cards = getEstateCardList();

  return (
    <RWAScreenContainer headerTitle="Home" onBackPress={goBack}>
      <View style={{ paddingHorizontal: 80 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: layout.spacing_x2,
            gap: layout.spacing_x2,
          }}
        >
          <RWAListsTab
            onPress={() => setSelectedTab(RWA_LIST_AVAILABLE)}
            text={RWA_LIST_AVAILABLE}
            isSelected={selectedTab === RWA_LIST_AVAILABLE}
          />
          <RWAListsTab
            onPress={() => setSelectedTab(RWA_LIST_COMING_SOON)}
            text={RWA_LIST_COMING_SOON}
            isSelected={selectedTab === RWA_LIST_COMING_SOON}
          />
          <RWAListsTab
            onPress={() => setSelectedTab(RWA_LIST_SOLD_OUT)}
            text={RWA_LIST_SOLD_OUT}
            isSelected={selectedTab === RWA_LIST_SOLD_OUT}
          />
        </View>
        {cards.length ? (
          <GridList
            minElemWidth={isMobile ? 328 : 384}
            keyExtractor={(item) => item.card.id}
            data={cards}
            renderItem={({ item }) => <EstateCard {...item} />}
          />
        ) : (
          <EstateCardListEmpty />
        )}
      </View>
    </RWAScreenContainer>
  );
};
