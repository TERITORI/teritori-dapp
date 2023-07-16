import React, { FC, Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { ProposalTransactionItemProps } from "./ProposalTransactionItem";
import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { Coin } from "../../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { useNSPrimaryAlias } from "../../../hooks/useNSPrimaryAlias";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { getUserId } from "../../../networks";
import {
  neutral33,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";

export const ProposalTransactionModal: FC<{
  visible?: boolean;
  onClose: () => void;
  transaction: ProposalTransactionItemProps;
}> = ({ visible, onClose, transaction }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { primaryAlias } = useNSPrimaryAlias(
    getUserId(selectedNetworkId, transaction.createdBy)
  );
  return (
    <ModalBase
      onClose={onClose}
      label={`Transaction #${transaction._id}`}
      visible={visible}
      width={800}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <BrandText style={fontSemibold14}>{transaction.type}</BrandText>
          <SpacerColumn size={2.5} />

          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <BrandText style={styles.textGray}>
              {primaryAlias
                ? `@${primaryAlias}`
                : tinyAddress(transaction.createdBy, 24)}
            </BrandText>
          </View>

          <SpacerColumn size={2.5} />

          {transaction.msgs.map((msg, index) => (
            <Fragment key={index}>
              <View style={styles.row}>
                <BrandText style={fontSemibold14}>Type URL: </BrandText>
                <BrandText style={styles.textGray}>{msg.typeUrl}</BrandText>
              </View>
              <SpacerColumn size={2.5} />

              {msg.value.contract && (
                <>
                  <View style={styles.row}>
                    <BrandText style={fontSemibold14}>Contract: </BrandText>
                    <BrandText style={styles.textGray}>
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
                      <View style={styles.row} key={index}>
                        <BrandText style={styles.textGray}>
                          {fund.amount} {fund.denom}
                        </BrandText>
                      </View>
                      <SpacerColumn size={2.5} />
                    </>
                  ))}
                </>
              )}

              {msg.value.msg && (
                <>
                  <BrandText style={fontSemibold14}>Message:</BrandText>
                  <SpacerColumn size={1} />
                  <View style={styles.msgContainer}>
                    <BrandText style={styles.textGray}>
                      {msg?.value?.msg &&
                        JSON.stringify(JSON.parse(msg.value.msg), null, 4)}
                    </BrandText>
                  </View>
                  <SpacerColumn size={2.5} />
                </>
              )}
            </Fragment>
          ))}
        </View>
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "column",
  },
  body: {
    flexDirection: "column",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  textGray: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      opacity: 0.5,
    },
  ]),
  msgContainer: {
    borderWidth: 1,
    borderColor: neutral77,
    borderRadius: 8,
    padding: layout.padding_x1,
  },
  footer: {
    borderColor: neutral33,
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});
