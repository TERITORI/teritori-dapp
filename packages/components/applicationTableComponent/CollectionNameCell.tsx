import { ViewStyle } from "react-native";

import avaPNG from "../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../assets/icons/check-badge.svg";
import { useIsMobile } from "../../hooks/useIsMobile";
import { fontSemibold11, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { RoundedGradientImage } from "../images/RoundedGradientImage";

interface Props {
  rowData: any; // currently i don't know the data types will change it once i will work on functionality
  style: ViewStyle;
}

export const CollectionNameCell = ({ rowData, style }: Props) => {
  const isMobile = useIsMobile();

  return (
    <OmniLink
      style={[
        style,
        {
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          marginRight: layout.spacing_x3,
        },
      ]}
      to={{
        screen: "ApplicationReview",
      }}
    >
      <RoundedGradientImage
        size="XS"
        sourceURI={avaPNG}
        style={{ marginRight: isMobile ? 8 : 16 }}
      />
      <BrandText
        style={[isMobile ? fontSemibold11 : fontSemibold13, { marginRight: 8 }]}
      >
        {rowData.collectionNameData}
      </BrandText>
      <SVG source={checkBadgeSVG} />
    </OmniLink>
  );
};
