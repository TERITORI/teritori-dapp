import { capitalize } from "lodash";
import React from "react";
import { Linking, useWindowDimensions, View } from "react-native";

import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniTable from "../components/Table/MiniTable";
import MiniTableRow from "../components/Table/MiniTableRow";

import questionSVG from "@/assets/icons/question-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { SpacerColumn } from "@/components/spacer";
import { getTxInfo } from "@/components/tx/getTxInfo";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { useGetAssets } from "@/hooks/wallet/useGetAssets";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { getNetwork } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC } from "@/utils/navigation";
import { blueDefault, neutral77 } from "@/utils/style/colors";
import { fontMedium15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

const resolveTxType = (
  tx: {
    type: string;
    transactionId: string;
    from: string;
    to: string;
    amount: {
      denom: string;
      amount: string;
    };
  },
  walletAddress: string | undefined,
) => {
  if (tx.type.toLowerCase().includes("send")) {
    if (tx.to === walletAddress) {
      return "Received";
    } else {
      return "Sent";
    }
  }
  return capitalize(tx.type);
};

const formatTx = (
  tx: {
    type: string;
    transactionId: string;
    from: string;
    to: string;
    amount: {
      denom: string;
      amount: string;
    };
  },
  walletAddress: string | undefined,
) => {
  const formattedTx = [];
  if (tx.type.toLowerCase().includes("send")) {
    if (tx.to === walletAddress) {
      formattedTx.push({ label: "Type", value: "Received" });
    } else {
      formattedTx.push({ label: "Type", value: "Sent" });
    }
  }
  if (tx.type.toLowerCase().includes("ibc")) {
    formattedTx.push({ label: "type", value: "IBC" });
  }
  formattedTx.push({ label: "Sender", value: tinyAddress(tx.from, 18) });
  formattedTx.push({ label: "To", value: tinyAddress(tx.to, 18) });
  formattedTx.push({
    label: "Amount",
    value: `${prettyPrice("teritori", tx.amount.amount, tx.amount.denom)}`,
  });
  formattedTx.push({
    label: "Status",
    value: "Success",
    icon: "link",
    onPress: async () => {
      console.log(tx);
      const url = "https://www.mintscan.io/teritori/tx/" + tx.transactionId;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    },
    valueColor: blueDefault,
  });
  return formattedTx;
};

export const TransactionDetailScreen: ScreenFC<"MiniTransactionDetail"> = ({
  navigation,
  route,
}) => {
  const selectedWallet = useSelectedNativeWallet();

  const { from, amount, to } = route.params;
  const { width: windowWidth } = useWindowDimensions();

  const {
    metadata: { image, tokenId },
  } = useNSUserInfo(`tori-${to}`);

  const assets = useGetAssets(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );
  const transactionDetail = formatTx(route.params, selectedWallet?.address);

  const selectedToken = assets.find((asset) => asset.denom === amount.denom);
  const resolvedType = resolveTxType(route.params, selectedWallet?.address);

  // let content;
  // const { MessagePreview } = getTxInfo(
  //   [message],
  //   navigation,
  //   getNetwork(networkId),
  // );
  // content = <MessagePreview />;

  return (
    <ScreenContainer
      headerMini={
        <CustomAppBar
          backEnabled
          left={
            <>
              <BrandText>{capitalize(resolvedType)}</BrandText>
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
      {/*{content}*/}
      <View
        style={{
          flex: 1,
          width: windowWidth,
          alignItems: "center",
        }}
      >
        <SpacerColumn size={4} />
        {image ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <UserAvatarWithFrame
              userId={`tori-${resolvedType.toLowerCase().includes("received") ? from : to}`}
              size="XXS"
            />
            <BrandText style={[fontMedium15, { color: neutral77 }]}>
              {tokenId}
            </BrandText>
          </View>
        ) : (
          <CircularImgOrIcon
            style={{ alignItems: "center", justifyContent: "center" }}
            icon={selectedToken?.logo_URIs?.png || questionSVG}
          />
        )}

        <View style={{ width: "100%", paddingHorizontal: layout.spacing_x2 }}>
          <SpacerColumn size={3} />
          <MiniTableRow
            leftLabel={
              <SVG source={teritoriCircleSVG} width={28} height={28} />
            }
            rightLabel={`${resolvedType.toLowerCase().includes("received") ? "+" : "-"} ${prettyPrice("teritori", amount.amount, amount.denom)}`}
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

export default TransactionDetailScreen;
