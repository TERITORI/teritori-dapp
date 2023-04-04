import React, { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";

import { TipModal } from "./TipModal";
import tipSVG from "../../../../assets/icons/tip.svg";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { CoingeckoCoin, getCoingeckoPrice } from "../../../utils/coingecko";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

export const TipButton: React.FC<{
  postId: string;
  author: string;
  amount: number;
  disabled?: boolean;
}> = ({ postId, author, amount, disabled }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const [tipModalVisible, setTipModalVisible] = useState(false);

  const denom = "utori";
  const coins: CoingeckoCoin[] = useMemo(
    () => [
      {
        networkId: selectedNetworkId,
        denom,
      },
    ],
    [selectedNetworkId]
  );
  const { prices } = useCoingeckoPrices(coins);
  const price = useMemo(
    () =>
      getCoingeckoPrice(selectedNetworkId, denom, amount.toString(), prices),
    [selectedNetworkId, amount, prices]
  );

  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => setTipModalVisible(true)}
        disabled={disabled}
      >
        <SVG source={tipSVG} width={20} height={20} />
        <SpacerRow size={1.5} />
        <BrandText style={[fontSemibold14, disabled && { color: neutral77 }]}>
          {`$${price ? price.toFixed(2) : "0"}`}
        </BrandText>
      </TouchableOpacity>

      <TipModal
        author={author}
        postId={postId}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
    </>
  );
};
