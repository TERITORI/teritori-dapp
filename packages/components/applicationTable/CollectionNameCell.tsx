import { View, ViewStyle } from "react-native";

import avaPNG from "../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../assets/icons/certified.svg";
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
        style={{
          marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x2,
        }}
      />
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          { marginRight: layout.spacing_x1 },
        ]}
      >
        {rowData.collectionNameData}
      </BrandText>
      <View style={{ width: 20, height: 20, flex: 1 }}>
        <SVG source={checkBadgeSVG} width={18} height={18} />
      </View>
    </OmniLink>
  );
};
