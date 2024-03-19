import React, { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";

import { TipModal } from "./TipModal";
import tipSolidSVG from "../../../../assets/icons/social/transfer-gray.svg";
import tipSVG from "../../../../assets/icons/tip.svg";
import { useWalletControl } from "../../../context/WalletControlProvider";
import { useAppMode } from "../../../hooks/useAppMode";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkFeature, NetworkKind } from "../../../networks";
import { CoingeckoCoin, getCoingeckoPrice } from "../../../utils/coingecko";
import { prettyPrice } from "../../../utils/coins";
import {
  neutral22,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

type TipAmountProps = {
  amount: number;
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
    [selectedNetworkId],
  );

  const { prices } = useCoingeckoPrices(coins);
  const price = useMemo(
    () =>
      getCoingeckoPrice(selectedNetworkId, denom, amount.toString(), prices),
    [selectedNetworkId, amount, prices],
  );

  return <>{`$${price ? price.toFixed(2) : "0"}`}</>;
};

export const TipButton: React.FC<{
  postId: string;
  author: string;
  amount: number;
  disabled?: boolean;
  useAltStyle?: boolean;
}> = ({ postId, author, amount, disabled, useAltStyle }) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { showConnectWalletModal } = useWalletControl();
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [tipAmountLocal, setTipAmountLocal] = useState(amount);
  const [appMode] = useAppMode();

  const onPress = async () => {
    if (!selectedWallet?.address || !selectedWallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature: NetworkFeature.SocialFeed,
        action: "Tip",
      });

      return;
    }

    setTipModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          { flexDirection: "row", alignItems: "center" },
          useAltStyle && {
            paddingVertical: layout.spacing_x0_75,
            paddingRight: layout.spacing_x1_5,
            paddingLeft: layout.spacing_x1,
            borderRadius: 999,
            backgroundColor: neutral22,
          },
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <SVG
          source={appMode === "mini" ? tipSolidSVG : tipSVG}
          width={20}
          height={20}
          color={secondaryColor}
        />
        <SpacerRow size={0.75} />
        <BrandText style={[fontSemibold13, disabled && { color: neutral77 }]}>
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
