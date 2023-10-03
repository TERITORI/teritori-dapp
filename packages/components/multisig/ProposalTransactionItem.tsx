import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { ProposalTransactionModal } from "./ProposalTransactionModal";
import { TransactionItemButtons } from "./TransactionItemButtons";
import { ParsedTransaction } from "../../hooks/multisig/useMultisigTransactions";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { getCosmosNetworkByChainId, getUserId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral17,
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { getTxInfo } from "../../utils/transactions/getTxInfo";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Separator } from "../Separator";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../spacer";

export interface ProposalTransactionItemProps extends ParsedTransaction {
  btnSquaresBackgroundColor?: string;
  isUserMultisig?: boolean;
  shouldRetch?: () => void;
}

export const ProposalTransactionItem: React.FC<ProposalTransactionItemProps> = (
  props
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
  const tnsMetadata = useNSUserInfo(creatorId);
  const [isHovered, setHovered] = useState(false);
  const [isProposalModalVisible, setProposalModalVisible] = useState(false);
  const approvedByCount = signatures.length || 0;
  const completedPercent = (approvedByCount / threshold) * 100;
  const isCompletelyDeclined = false; /*
    (multisig.userAddresses?.length || 0) -
      approvedByCount -
      currentDecliners.length <
    approvalRequiredCount - approvedByCount;
    */

  const [txName, txInfo, txInfo2, txIcon] = getTxInfo(
    msgs,
    navigation,
    network
  );

  /*

  // hooks
  useEffect(() => {
    setCurrentSignatures(signatures?.data || []);
  }, [signatures?.data]);

  */

  // functions
  const addSignature = (signature: unknown) => {
    /*
    setCurrentSignatures((prevState: DbSignature[]) => [
      ...prevState,
      signature,
    ]);
    */
  };

  const addDecliner = (address: string) => {
    //setCurrentDecliners((prevState) => [...prevState, address]);
  };

  // returns
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

        <View style={[sectionCStyle, { flex: 0.75 }]}>
          <BrandText style={StyleSheet.flatten(fontSemibold14)}>
            {txName}
          </BrandText>
          <SpacerColumn size={0.75} />
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
          <SpacerColumn size={0.75} />
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Created by:</BrandText>
            <SpacerRow size={0.5} />
            {tnsMetadata.loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <AnimationFadeIn>
                <Pressable
                  onPress={() =>
                    navigation.navigate("UserPublicProfile", { id: creatorId })
                  }
                >
                  <BrandText
                    style={StyleSheet.flatten([
                      fontSemibold13,
                      { color: primaryColor },
                    ])}
                  >
                    {tnsMetadata?.metadata?.tokenId
                      ? `@${tnsMetadata?.metadata?.tokenId}`
                      : tinyAddress(creatorAddress, 14)}
                  </BrandText>
                </Pressable>
              </AnimationFadeIn>
            )}
          </View>
        </View>

        <View style={sectionCStyle}>
          {txInfo2}
          <SpacerColumn size={0.75} />
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Network fee:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={brandTextSmallCStyle}>
              {prettyPrice(
                network?.id,
                fee.amount[0]?.amount,
                fee.amount[0]?.denom
              )}
            </BrandText>
          </View>
        </View>

        <View style={[sectionCStyle, { flex: 1.5 }]}>
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Approved by:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {approvedByCount}
            </BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={brandTextNormalCStyle}>of</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {threshold}
            </BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={brandTextNormalCStyle}>
              ({threshold - approvedByCount} required)
            </BrandText>
          </View>
          <SpacerColumn size={1.5} />
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

        <TransactionItemButtons
          {...props}
          currentDecliners={/*currentDecliners*/ []}
          addSignature={addSignature}
          addDecliner={addDecliner}
          isCompletelyDeclined={isCompletelyDeclined}
          btnSquaresBackgroundColor={
            isHovered ? neutral17 : props.btnSquaresBackgroundColor
          }
        />
      </CustomPressable>

      <ProposalTransactionModal
        visible={isProposalModalVisible}
        onClose={() => setProposalModalVisible(false)}
        transaction={props}
      />
    </>
  );
};

const sectionCStyle: ViewStyle = { flex: 1, paddingRight: layout.spacing_x1_5 };
const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const brandTextNormalCStyle: ViewStyle = StyleSheet.flatten([
  fontSemibold14,
  { color: neutral77 },
]);
const brandTextSmallCStyle: ViewStyle = StyleSheet.flatten([
  fontSemibold13,
  { color: neutral77 },
]);
