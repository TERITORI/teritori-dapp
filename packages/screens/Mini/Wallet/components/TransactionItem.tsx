import { View } from "react-native";

import arrowUpSVG from "../../../../../assets/icons/arrow-up.svg";
import checkSVG from "../../../../../assets/icons/check.svg";
import teritoriSVG from "../../../../../assets/icons/networks/teritori.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import {
  blueDefault,
  neutral1A,
  neutral44,
  neutral88,
} from "../../../../utils/style/colors";
import { fontMedium15, fontSemibold16 } from "../../../../utils/style/fonts";
import { capitalizeStr } from "../TransactionDetailScreen";

export type TransactionType = {
  id: string;
  type: "send" | "deposit";
  status: "pending" | "success";
  img?: string;
  amount: { tori: number; dollar: number };
  to: string;
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
  const { type, img, status, to, amount } = transaction;
  return (
    <CustomPressable onPress={onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: neutral1A,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <SVGorImageIcon
              icon={img || teritoriSVG}
              iconSize={img ? 40 : 20}
              style={{ borderRadius: img ? 20 : 10 }}
            />
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 7.5,
                backgroundColor: status === "pending" ? neutral44 : blueDefault,
                position: "absolute",
                bottom: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG
                source={status === "pending" ? arrowUpSVG : checkSVG}
                width={12}
                height={12}
                fill="#fff"
              />
            </View>
          </View>
          <SpacerRow size={1.5} />
          <View style={{ flex: 1 }}>
            <BrandText style={fontSemibold16}>{capitalizeStr(type)}</BrandText>
            <SpacerColumn size={0.5} />
            <BrandText style={[fontMedium15, { color: neutral88 }]}>
              To: {to}
            </BrandText>
            {!isLastItem && <Separator style={{ marginTop: 16 }} />}
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <BrandText style={fontSemibold16}>
            {type === "send" ? "-" : "+"} {amount.tori} TORI
          </BrandText>
          <SpacerColumn size={0.5} />
          <BrandText style={[fontMedium15, { color: neutral88 }]}>
            ${amount.dollar}
          </BrandText>
          {!isLastItem && <Separator style={{ marginTop: 16 }} />}
        </View>
      </View>
    </CustomPressable>
  );
}
