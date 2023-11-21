import { FlatList, View } from "react-native";

import { EstateCardTags } from "./EstateCard";
import { EstateCardInformationBox } from "./EstateCardInformations";
import { EstateCardProps, PortfolioEstateCardProps } from "./types";
import RealEstatePlaceholder from "../../../../../assets/default-images/estate-placeholder.png";
import { BrandText } from "../../../../components/BrandText";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { useTheme } from "../../../../hooks/useTheme";
import { fontSemibold16 } from "../../../../utils/style/fonts";

export const PortfolioEstateCard: React.FC<EstateCardProps> = ({
  tags,
  card,
}) => {
  const theme = useTheme();
  const imageWidth = 284;
  const imageHeight = 152;

  return (
    <View style={{ margin: 7 }}>
      <TertiaryBox
        noBrokenCorners
        mainContainerStyle={{
          backgroundColor: theme.headerBackgroundColor,
          borderColor: theme.borderColor,
          padding: 15,
          // alignItems: "flex-start",
        }}
        width={316}
        height={551}
        squaresBackgroundColor={theme.backgroundColor}
      >
        <OptimizedImage
          sourceURI={RealEstatePlaceholder}
          width={imageWidth}
          height={imageHeight}
          style={{ width: imageWidth, height: imageHeight, borderRadius: 8 }}
        />
        <View style={{ marginTop: 10 }}>
          <EstateCardTags tags={tags.slice(0, 2)} />
        </View>
        <BrandText numberOfLines={1} style={fontSemibold16}>
          {card.title}
        </BrandText>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 10,
          }}
        >
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="Property Value"
            value="96.600 USDC"
          />
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="Target APY"
            value="11.39%"
          />
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="Rental Status"
            value="Rented"
          />
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="My Tokens"
            value="5/1,932"
          />
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="My Target ROI"
            value="28.45 USDC"
          />
          <EstateCardInformationBox
            style={{ width: 136, height: 66 }}
            label="My Collected ROI"
            value="0.00 USDC"
          />
        </View>
        <PrimaryButton
          style={{ marginTop: 15 }}
          text="View Property"
          fullWidth
        />
      </TertiaryBox>
    </View>
  );
};

export const PortfolioEstateCardList: React.FC<PortfolioEstateCardProps> = ({
  cards,
}) => {
  return (
    <FlatList
      contentContainerStyle={{
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
      }}
      data={cards}
      keyExtractor={(item) => item.card.id}
      renderItem={({ item }) => <PortfolioEstateCard {...item} />}
    />
  );
};
