import React, { FC, Fragment } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ProposalTransactionItemProps } from "./ProposalTransactionItem";
import { Coin } from "../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { getCosmosNetworkByChainId, getUserId } from "../../networks";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

export const ProposalTransactionModal: FC<{
  visible?: boolean;
  onClose: () => void;
  transaction: ProposalTransactionItemProps;
}> = ({ visible, onClose, transaction }) => {
  const network = getCosmosNetworkByChainId(transaction.chainId);
  const { primaryAlias } = useNSPrimaryAlias(
    getUserId(network?.id, transaction.creatorAddress)
  );
  return (
    <ModalBase
      onClose={onClose}
      label="Transaction #TODO"
      visible={visible}
      width={800}
    >
      <View
        style={{
          marginTop: 10,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            marginBottom: 10,
          }}
        >
          <BrandText style={fontSemibold14}>
            {/*transaction.type*/ "TODO"}
          </BrandText>
          <SpacerColumn size={2.5} />

          <View style={rowStyles}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <BrandText style={textGrayStyles}>
              {primaryAlias
                ? `@${primaryAlias}`
                : tinyAddress(transaction.creatorAddress, 24)}
            </BrandText>
          </View>

          <SpacerColumn size={2.5} />

          {transaction.msgs.map((msg, index) => (
            <Fragment key={index}>
              <View style={rowStyles}>
                <BrandText style={fontSemibold14}>Type URL: </BrandText>
                <BrandText style={textGrayStyles}>{msg.typeUrl}</BrandText>
              </View>
              <SpacerColumn size={2.5} />

              {msg.value.contract && (
                <>
                  <View style={rowStyles}>
                    <BrandText style={fontSemibold14}>Contract: </BrandText>
                    <BrandText style={textGrayStyles}>
                      {msg.value.contract}
                    </BrandText>
                  </View>
                  <SpacerColumn size={2.5} />
                </>
              )}

              {msg.value.funds?.length && (
                <>
                  <BrandText style={fontSemibold14}>Funds:</BrandText>
                  {msg.value.funds.map((fund: Coin, index: number) => (
                    <>
                      <View style={rowStyles} key={index}>
                        <BrandText style={textGrayStyles}>
                          {fund.amount} {fund.denom}
                        </BrandText>
                      </View>
                      <SpacerColumn size={2.5} />
                    </>
                  ))}
                </>
              )}

              {/*msg.value.msg && (
                <>
                  <BrandText style={fontSemibold14}>Message:</BrandText>
                  <SpacerColumn size={1} />
                  <View style={{
                      borderWidth: 1,
                      borderColor: neutral77,
                      borderRadius: 8,
                      padding: layout.padding_x1,
                    }
                  }>
                    <BrandText style={textGrayStyles}>
                      {msg?.value?.msg &&
                        JSON.stringify(JSON.parse(msg.value.msg), null, 4)}
                    </BrandText>
                  </View>
                  <SpacerColumn size={2.5} />
                </>
              )*/}
            </Fragment>
          ))}
        </View>
      </View>
    </ModalBase>
  );
};

const rowStyles: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const textGrayStyles: ViewStyle = StyleSheet.flatten([
  fontSemibold14,
  {
    color: secondaryColor,
    opacity: 0.5,
  },
]);
