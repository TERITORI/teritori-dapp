import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { MultisigTransactionActions } from "./MultisigTransactionActions";
import { MultisigTransactionModal } from "./MultisigTransactionModal";
import { ParsedTransaction } from "../../hooks/multisig/useMultisigTransactions";
import { getCosmosNetworkByChainId, getUserId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral17,
  neutral33,
  neutral55,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { getTxInfo } from "../../utils/transactions/getTxInfo";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { Separator } from "../separators/Separator";
import { SpacerRow } from "../spacer";
import { Username } from "../user/Username";

export interface MultisigTransactionItemProps extends ParsedTransaction {
  btnSquaresBackgroundColor?: string;
  shouldRetch?: () => void;
}

export const MultisigTransactionItem: React.FC<MultisigTransactionItemProps> = (
  props,
) => {
  const {
    chainId,
    msgs,
    createdAt,
    fee,
    creatorAddress,
    threshold,
    signatures,
  } = props;
  const navigation = useAppNavigation();
  const network = getCosmosNetworkByChainId(chainId);
  const creatorId = getUserId(network?.id, creatorAddress);
  const [isHovered, setHovered] = useState(false);
  const [isProposalModalVisible, setProposalModalVisible] = useState(false);
  const approvedByCount = signatures.length || 0;
  const completedPercent = (approvedByCount / threshold) * 100;

  const {
    name: txName,
    small1: txInfo,
    small2: txInfo2,
    icon: txIcon,
  } = getTxInfo(msgs, navigation, network, {
    textStyle: { ...brandTextNormalCStyle, color: "white" },
  });

  return (
    <>
      <CustomPressable
        onPress={() => setProposalModalVisible(true)}
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            borderBottomWidth: 1,
            borderColor: neutral33,
            flex: 1,
          },
          isHovered && { backgroundColor: neutral17 },
        ]}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <View style={{ padding: layout.spacing_x2 }}>
          <SVG source={txIcon} width={32} height={32} />
        </View>

        <View style={sectionCStyle}>
          <BrandText style={[brandTextNormalCStyle, { color: "white" }]}>
            {txName}
          </BrandText>
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextSmallCStyle}>
              {moment(createdAt).format("DD/MM/yyyy")}
            </BrandText>
            <SpacerRow size={0.5} />
            <Separator horizontal />
            <SpacerRow size={0.5} />
            <BrandText style={brandTextSmallCStyle}>
              {moment(createdAt).format("h:mm")}
            </BrandText>
          </View>
        </View>

        <View style={sectionCStyle}>
          {txInfo}
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextSmallCStyle}>Created by:</BrandText>
            <SpacerRow size={0.5} />
            <Username
              userId={creatorId}
              textStyle={[brandTextSmallCStyle, { color: undefined }]}
            />
          </View>
        </View>

        <View style={sectionCStyle}>
          {txInfo2}
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextSmallCStyle}>Network fee: </BrandText>
            <BrandText style={brandTextSmallCStyle}>
              {prettyPrice(
                network?.id,
                fee.amount[0]?.amount,
                fee.amount[0]?.denom,
              )}
            </BrandText>
          </View>
        </View>

        <View style={sectionCStyle}>
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Approved by:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={[brandTextNormalCStyle, { color: "white" }]}>
              {approvedByCount}
            </BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={brandTextNormalCStyle}>of</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={[brandTextNormalCStyle, { color: "white" }]}>
              {threshold}
            </BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={brandTextNormalCStyle}>
              ({threshold - approvedByCount} required)
            </BrandText>
          </View>
          <View style={{ height: 13, justifyContent: "center" }}>
            <View
              style={{
                height: 6,
                width: 207,
                backgroundColor: neutral55,
              }}
            >
              <View
                style={{
                  height: 6,
                  backgroundColor: secondaryColor,
                  width: `${completedPercent}%`,
                }}
              />
            </View>
          </View>
        </View>

        <MultisigTransactionActions
          {...props}
          btnSquaresBackgroundColor={
            isHovered ? neutral17 : props.btnSquaresBackgroundColor
          }
        />
      </CustomPressable>

      <MultisigTransactionModal
        visible={isProposalModalVisible}
        onClose={() => setProposalModalVisible(false)}
        transaction={props}
      />
    </>
  );
};

const sectionCStyle: ViewStyle = {
  flex: 1,
  height: 36,
  paddingRight: layout.spacing_x1_5,
  justifyContent: "space-between",
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const brandTextNormalCStyle: ViewStyle = StyleSheet.flatten([
  fontSemibold14,
  { color: neutral77, lineHeight: 14 },
]);

const brandTextSmallCStyle: ViewStyle = StyleSheet.flatten([
  fontSemibold13,
  { color: neutral77, lineHeight: 13 },
]);
