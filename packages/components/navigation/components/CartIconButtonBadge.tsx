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
import { neutral17, secondaryColor } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SpacerRow } from "../../spacer";

export const CartIconButtonBadge: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
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
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
        >
          <ShoppingCartIcon width={16} height={16} color={secondaryColor} />

          <SpacerRow size={1} />
          <BrandText
            style={[
              fontMedium14,
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
