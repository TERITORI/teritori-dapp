import * as Clipboard from "expo-clipboard";
import { capitalize } from "lodash";
import { useWindowDimensions, View } from "react-native";

import checkSVG from "../../../../assets/icons/check-white.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { blueDefault, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import RowDisplay from "../components/RowDisplay";
import MiniTable from "../components/Table/MiniTable";

export type TransactionDetailType = {
  id: string;
  label: string;
  address: string;
};

const transactionDetail = [
  {
    label: "date",
    value: "Dec 1, 2023 00:00:01 AM",
  },
  { label: "type", value: "Send" },
  {
    label: "status",
    value: "Success",
    icon: "link",
    onPress: () => {},
    valueColor: blueDefault,
  },
  {
    label: "to",
    value: "asdidjfdijf",
    icon: "copy",
    onPress: () =>
      copyToClipboard(
        JSON.stringify({
          token: "asdidjfdijf",
          type: "to",
        }),
      ),
  },
  {
    label: "txId",
    value: "nijijndfijdif",
    icon: "copy",
    onPress: () =>
      copyToClipboard(
        JSON.stringify({
          token: "nijijndfijdif",
          type: "txId",
        }),
      ),
  },
  { label: "fee", value: "0.000001 TORI" },
];

const TransactionDetailScreen: ScreenFC<"MiniTransactionDetail"> = ({
  navigation,
  route,
}) => {
  const { type } = route.params;
  const { width: windowWidth } = useWindowDimensions();

  return (
    <ScreenContainer
      headerMini={
        <CustomAppBar
          backEnabled
          left={
            <>
              <BrandText>{capitalize(type)} </BrandText>
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
          width: windowWidth,
          alignItems: "center",
        }}
      >
        <SpacerColumn size={4} />
        <CircularImgOrIcon
          size={120}
          icon={checkSVG}
          backgroundColor={blueDefault}
        />

        <View style={{ width: "100%", paddingHorizontal: layout.spacing_x2 }}>
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

          <MiniTable items={transactionDetail} />
        </View>
      </View>
    </ScreenContainer>
  );
};

export function capitalizeStr(str: string) {
  const firstLetter = str.slice(0, 1).toUpperCase();
  const lastLetter = str.slice(1);
  return firstLetter + lastLetter;
}

export async function copyToClipboard(value: string) {
  await Clipboard.setStringAsync(value);
  alert("Copied");
}

export default TransactionDetailScreen;
