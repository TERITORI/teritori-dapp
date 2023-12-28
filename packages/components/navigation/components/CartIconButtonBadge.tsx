import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { ShoppingCartIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";

import {
  selectAllSelectedNFTData,
  setShowCart,
} from "../../../store/slices/marketplaceCartItems";
import { useAppDispatch } from "../../../store/store";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral17,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SpacerRow } from "../../spacer";

export const CartIconButtonBadge: React.FC<{
  style?: StyleProp<ViewStyle>;
  isMobile?: boolean;
}> = ({ style, isMobile }) => {
  const selected = useSelector(selectAllSelectedNFTData);
  const navigation = useAppNavigation();

  const dispatch = useAppDispatch();

  const handleShowCart = () => {
    dispatch(setShowCart(true));
    if (selected.length > 0) {
      const id = selected[0].id.slice(0, selected[0].id.lastIndexOf("-"));
      navigation.navigate("Collection", { id });
    }
  };

  return selected.length > 0 ? (
    <View style={style}>
      <TouchableOpacity onPress={handleShowCart}>
        <TertiaryBox
          style={{
            flexDirection: "row",
            paddingHorizontal: isMobile
              ? layout.spacing_x1
              : layout.spacing_x1_5,
            backgroundColor: isMobile ? neutral00 : neutral17,
            height: isMobile ? 32 : 40,
          }}
        >
          <ShoppingCartIcon width={16} height={16} color={secondaryColor} />

          <SpacerRow size={1} />
          <BrandText
            style={[
              isMobile ? fontSemibold12 : fontMedium14,
              {
                color: "white",
              },
            ]}
          >
            {selected.length}
          </BrandText>
        </TertiaryBox>
      </TouchableOpacity>
    </View>
  ) : null;
};
