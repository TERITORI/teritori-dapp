import { View } from "react-native";

import arrowUpSVG from "@/assets/icons/arrow-up.svg";
import checkSVG from "@/assets/icons/check.svg";
import teritoriSVG from "@/assets/icons/networks/teritori.svg";
import { capitalizeStr } from "../TransactionDetailScreen";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { prettyPrice } from "@/utils/coins";
import {
  blueDefault,
  neutral1A,
  neutral44,
  neutral88,
} from "@/utils/style/colors";
import { fontMedium13, fontMedium14 } from "@/utils/style/fonts";
import { tinyAddress } from "@/utils/text";

type TransactionType = {
  txhash: string;
  tx: {
    "@type": "/cosmos.bank.v1beta1.MsgSend";
    from_address: string;
    to_address: string;
    amount: [
      {
        denom: string;
        amount: string;
      },
    ];
  };
};

type TransactionItemProps = {
  transaction: TransactionType;
  onPress?: () => void;
  isLastItem: boolean;
};

export default function TransactionItem({
  transaction,
  onPress,
  isLastItem,
}: TransactionItemProps) {
  const selectedWallet = useSelectedNativeWallet();
  const address = selectedWallet?.address;

  const from = tinyAddress(transaction.tx.from_address);
  const to = tinyAddress(transaction.tx.to_address);
  const amount = transaction.tx.amount[0].amount;
  const denom = transaction.tx.amount[0].denom;
  const img = null;
  const type = transaction.tx.to_address !== address ? "send" : "receive";

  const status = "success"; // we are only getting completed transactions at this point
  const coin = { amount, denom, dollar: 0 };

  return (
    <CustomPressable onPress={onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: neutral1A,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <SVGorImageIcon
              icon={img || teritoriSVG}
              iconSize={img ? 36 : 18}
              style={{ borderRadius: img ? 18 : 9 }}
            />

            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: status !== "success" ? neutral44 : blueDefault,
                position: "absolute",
                bottom: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG
                source={status !== "success" ? arrowUpSVG : checkSVG}
                width={10}
                height={10}
                fill="#fff"
              />
            </View>
          </View>

          <SpacerRow size={1.5} />

          <View style={{ flex: 1 }}>
            <BrandText style={fontMedium14}>{capitalizeStr(type)}</BrandText>

            <SpacerColumn size={0.5} />

            <BrandText style={[fontMedium13, { color: neutral88 }]}>
              {type === "send" ? `To:${to}` : `From:${from}`}
            </BrandText>

            {!isLastItem && <Separator style={{ marginTop: 16 }} />}
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <BrandText style={fontMedium14}>
            {type === "send" ? "-" : "+"}{" "}
            {prettyPrice("teritori", coin.amount, coin.denom)}
          </BrandText>

          <SpacerColumn size={0.5} />

          <BrandText style={[fontMedium13, { color: neutral88 }]}>
            ${coin.dollar}
          </BrandText>

          {!isLastItem && <Separator style={{ marginTop: 16 }} />}
        </View>
      </View>
    </CustomPressable>
  );
}
