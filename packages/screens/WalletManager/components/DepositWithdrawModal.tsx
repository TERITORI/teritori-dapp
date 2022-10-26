// libraries
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import arrowDivideSVG from "../../../../assets/icons/arrow-divide.svg";
import logoSVG from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { MaxButton } from "../../../components/buttons/MaxButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { DEPOSIT_WITHDARW_TYPE } from "../../../utils/faking";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { capitalize } from "../../../utils/text";
import { TransactionAccount, TransactionForm } from "../types";
import { AccountListDropdown } from "./AccountListDropdown";

type DepositModalProps = {
  variation: "deposit" | "withdraw";
  isVisible: boolean;
  onClose: () => void;
};

export const DepositWithdrawModal: React.FC<DepositModalProps> = ({
  variation,
  isVisible,
  onClose,
}) => {
  // variables
  const { control, setValue, handleSubmit } = useForm<TransactionForm>();
  const [fromAccount, setFromAccount] = useState<TransactionAccount>(
    DEPOSIT_WITHDARW_TYPE.atom
  );
  const [toAccount, setToAccount] = useState<TransactionAccount>(
    DEPOSIT_WITHDARW_TYPE.teritori
  );

  useEffect(() => {
    onChangeFrom(DEPOSIT_WITHDARW_TYPE.atom);
    onChangeTo(DEPOSIT_WITHDARW_TYPE.teritori);
  }, []);

  // functions
  const onChangeFrom = (account: TransactionAccount) => {
    setValue("fromAddress", account.account);
    setFromAccount(account);
    setValue("amount", "0");
  };

  const onChangeTo = (account: TransactionAccount) => {
    setValue("toAddress", account.account);
    setToAccount(account);
    setValue("amount", "0");
  };

  // returns
  const ModalHeader = useCallback(
    () => (
      <View style={styles.rowCenter}>
        <SVG source={logoSVG} width={32} height={32} />
        <SpacerRow size={3} />
        <BrandText>
          {variation === "deposit"
            ? "Deposit on TERITORI"
            : "Withdraw from TERITORI"}
        </BrandText>
      </View>
    ),
    [variation]
  );

  return (
    <ModalBase visible={isVisible} onClose={onClose} Header={ModalHeader}>
      <View style={styles.container}>
        <BrandText style={[fontSemibold14, styles.selfCenter]}>
          {capitalize(variation)} {fromAccount.name}
        </BrandText>
        <SpacerColumn size={1.5} />
        <View style={[styles.rowCenter, styles.w100, { zIndex: 2 }]}>
          <View style={[styles.jcCenter, { zIndex: 2 }]}>
            <View style={[styles.rowAllCenter, { zIndex: 2 }]}>
              <View style={styles.leftChevron}>
                <AccountListDropdown
                  variation="left"
                  accounts={Object.values(DEPOSIT_WITHDARW_TYPE)}
                  onSelect={onChangeFrom}
                />
              </View>
              <SVG source={fromAccount.icon} width={64} height={64} />
            </View>
            <SpacerColumn size={1.5} />
            <BrandText style={fontSemibold14}>
              From {fromAccount.name}
            </BrandText>
            <SpacerColumn size={1} />
            <TextInputCustom<TransactionForm>
              control={control}
              variant="labelOutside"
              name="fromAddress"
              label=""
              rules={{ required: true }}
              disabled
            />
          </View>

          <SpacerRow size={1} />
          <View style={styles.arrow}>
            <SVG source={arrowDivideSVG} width={36} height={6} />
          </View>
          <SpacerRow size={1} />

          <View style={styles.jcCenter}>
            <View style={[styles.rowAllCenter, { zIndex: 2 }]}>
              <SVG source={toAccount.icon} width={64} height={64} />
              <View style={styles.rightChevron}>
                <AccountListDropdown
                  variation="right"
                  accounts={Object.values(DEPOSIT_WITHDARW_TYPE)}
                  onSelect={onChangeTo}
                />
              </View>
            </View>
            <SpacerColumn size={1.5} />
            <BrandText style={fontSemibold14}>To {toAccount.name}</BrandText>
            <SpacerColumn size={1} />
            <TextInputCustom<TransactionForm>
              control={control}
              variant="labelOutside"
              name="toAddress"
              label=""
              rules={{ required: true }}
              disabled
            />
          </View>
        </View>
        <SpacerColumn size={4} />

        <TextInputCustom<TransactionForm>
          control={control}
          variant="labelOutside"
          label="Select Amount"
          name="amount"
          rules={{ required: true }}
          subtitle={`Available balance: ${fromAccount.amount}`}
        >
          <MaxButton
            onPress={() => setValue("amount", fromAccount.amount.toString())}
          />
        </TextInputCustom>
        <SpacerColumn size={4} />
        <BrandText style={styles.estimatedText}>
          Estimated Time: 20 Seconds
        </BrandText>
        <SpacerColumn size={1} />
        <PrimaryButton
          size="M"
          text={capitalize(variation)}
          fullWidth
          onPress={handleSubmit(onClose)}
        />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  selfCenter: {
    alignSelf: "center",
  },
  w100: { width: "100%" },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftChevron: {
    position: "absolute",
    left: -(layout.padding_x3 * 2),
  },
  rightChevron: {
    position: "absolute",
    right: -(layout.padding_x3 * 2),
  },
  jcCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowAllCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  arrow: {
    alignSelf: "flex-start",
    marginTop: 64 / 2,
  },
  container: {
    paddingBottom: layout.padding_x3,
  },
  estimatedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
