import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { Dimensions, View } from "react-native";
import { SvgProps } from "react-native-svg";

import checkSVG from "../../../../assets/icons/check-white.svg";
import copySVG from "../../../../assets/icons/copy-gray.svg";
import externalLinkSVG from "../../../../assets/icons/external-grey.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import {
  blueDefault,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontBold16, fontSemibold15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import CircularImgOrIcon from "../AddressBook/components/CircularImgOrIcon";
import MiniHeader from "../Notifications/components/MiniHeader";
import RowDisplay from "../components/RowDisplay";

interface TransactionDetailScreenProps
  extends NativeStackScreenProps<RootStackParamList, "MiniTransactionDetail"> {}

export type TransactionDetailType = {
  id: string;
  label: string;
  address: string;
};

const transactionDetail: { [key: string]: any } = {
  date: "Dec 1, 2023 00:00:01 AM",
  type: "Send",
  status: { code: "success", link: "" },
  to: "asdfinidnfdf",
  txId: "ndifdfjdsdf",
  fee: 0.000001,
};

export default function TransactionDetailScreen({
  navigation,
  route,
}: TransactionDetailScreenProps) {
  const { type } = route.params;

  return (
    <ScreenContainer
      headerMini={
        <MiniHeader
          navigation={navigation}
          backEnabled
          left={
            <>
              <BrandText>{type} </BrandText>
              <BrandText style={[fontSemibold15, { color: neutralA3 }]}>
                (to:naisdnfasdf)
              </BrandText>
            </>
          }
          headerStyle={{ backgroundColor: "#000" }}
        />
      }
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          alignItems: "center",
        }}
      >
        <SpacerColumn size={4} />
        <CircularImgOrIcon
          size={120}
          icon={checkSVG}
          backgroundColor={blueDefault}
        />

        <View style={{ width: "100%", paddingHorizontal: layout.spacing_x1_5 }}>
          <SpacerColumn size={3} />
          <RowDisplay
            leftLabel={
              <SVG source={teritoriCircleSVG} width={28} height={28} />
            }
            rightLabel="-2000 TORI"
            style={{
              borderWidth: 2,
              borderColor: blueDefault,
              backgroundColor: "#000",
            }}
          />

          <SpacerColumn size={2} />
          {Object.keys(transactionDetail).map((item, index) => {
            const firstItem = index === 0;
            const lastItem =
              Object.keys(transactionDetail).length - 1 === index;

            const rightLabel =
              item === "status" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BrandText style={[fontBold16, { color: blueDefault }]}>
                    {capitalizeStr(transactionDetail[item].code)}
                  </BrandText>
                  <SpacerRow size={1} />
                  <IconButton onPress={() => {}} icon={externalLinkSVG} />
                </View>
              ) : item === "to" || item === "txId" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BrandText style={fontBold16}>
                    {transactionDetail[item]}
                  </BrandText>
                  <SpacerRow size={1} />
                  <IconButton
                    onPress={() =>
                      copyToClipboard(
                        JSON.stringify({
                          token: transactionDetail[item],
                          type: item,
                        }),
                      )
                    }
                    icon={copySVG}
                  />
                </View>
              ) : item === "fee" ? (
                `${transactionDetail[item].toFixed(6)} TORI`
              ) : (
                transactionDetail[item]
              );

            return (
              <RowDisplay
                key={item}
                leftLabel={capitalizeStr(item)}
                style={{
                  borderRadius: 0,
                  borderWidth: 1,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: lastItem ? 1 : 0,
                  borderTopRightRadius: firstItem ? 14 : 0,
                  borderTopLeftRadius: firstItem ? 14 : 0,
                  borderBottomLeftRadius: lastItem ? 14 : 0,
                  borderBottomRightRadius: lastItem ? 14 : 0,
                  borderColor: withAlpha(secondaryColor, 0.12),
                }}
                rightLabel={rightLabel}
              />
            );
          })}

          <SpacerColumn size={2} />
        </View>
      </View>
    </ScreenContainer>
  );
}

export function capitalizeStr(str: string) {
  const firstLetter = str.slice(0, 1).toUpperCase();
  const lastLetter = str.slice(1);
  return firstLetter + lastLetter;
}

type IconButtonProps = {
  icon: React.FC<SvgProps> | string;
  iconSize?: number;
  onPress?: () => void;
};

function IconButton({ icon, iconSize, onPress }: IconButtonProps) {
  return (
    <CustomPressable onPress={onPress}>
      <SVG source={icon} width={iconSize ?? 22} height={iconSize ?? 22} />
    </CustomPressable>
  );
}

export async function copyToClipboard(value: string) {
  await Clipboard.setStringAsync(value);
  alert("Copied");
}
