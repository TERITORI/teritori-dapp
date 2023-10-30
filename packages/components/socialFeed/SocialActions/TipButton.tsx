import React, { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";

import { TipModal } from "./TipModal";
import tipSVG from "../../../../assets/icons/tip.svg";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../../networks";
import { CoingeckoCoin, getCoingeckoPrice } from "../../../utils/coingecko";
import { prettyPrice } from "../../../utils/coins";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

type TipAmountProps = {
  amount: number | undefined;
  networkId?: string;
};
const GnoTipAmount: React.FC<TipAmountProps> = ({ amount, networkId }) => {
  return <>{prettyPrice(networkId, "" + amount, "ugnot")}</>;
};

const TeritoriTipAmount: React.FC<TipAmountProps> = ({ amount }) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";

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
      getCoingeckoPrice(
        selectedNetworkId,
        denom,
        amount?.toString() || "0",
        prices
      ),
    [selectedNetworkId, amount, prices]
  );

  return <>{`$${price ? price.toFixed(2) : "0"}`}</>;
};

export const TipButton: React.FC<{
  postId: string;
  author: string;
  amount: number;
  disabled?: boolean;
}> = ({ postId, author, amount, disabled }) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [tipAmountLocal, setTipAmountLocal] = useState(amount);

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
          {selectedNetworkInfo?.kind === NetworkKind.Gno ? (
            <GnoTipAmount
              networkId={selectedNetworkInfo.id}
              amount={tipAmountLocal}
            />
          ) : (
            <TeritoriTipAmount amount={amount} />
          )}
        </BrandText>
      </TouchableOpacity>

      <TipModal
        author={author}
        postId={postId}
        onClose={(newTipAmount: number | undefined) => {
          setTipModalVisible(false);
          newTipAmount && setTipAmountLocal(amount + newTipAmount);
        }}
        isVisible={tipModalVisible}
      />
    </>
  );
};
