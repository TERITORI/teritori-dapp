import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import warningTriangleSVG from "../../../../assets/icons/warning-triangle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { numberWithThousandsSeparator } from "../../../utils/numbers";
import {
  errorColor,
  neutral22,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { toriDisplayDenom } from "../../../utils/teritori";
import { StakeFormValuesType, StakeType } from "../types";

interface StakeFormModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: StakeType;
}

const MAX_VALUE = 43554434;

export const StakeFormModal: React.FC<StakeFormModalProps> = ({
  onClose,
  visible,
  data,
}) => {
  // variables
  const { control, setValue, handleSubmit, watch, reset } =
    useForm<StakeFormValuesType>();
  const watchAll = watch();

  // hooks
  useEffect(() => {
    reset();
  }, [visible]);

  // functions
  const onSubmit = (formData: StakeFormValuesType) => {
    console.log(formData);
    onClose && onClose();
  };

  // returns
  const Header = useCallback(
    () => (
      <View>
        <BrandText style={fontSemibold20}>Stake Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select a validator and amount of {toriDisplayDenom} to stake.
        </BrandText>
      </View>
    ),
    [data]
  );

  const Footer = useCallback(
    () => (
      <>
        <Separator />
        <View style={styles.footerRow}>
          <SecondaryButton
            size="XS"
            text="Cancel"
            width={120}
            onPress={onClose}
          />
          <SpacerRow size={2} />
          <PrimaryButton
            size="XS"
            text="Stake"
            width={120}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </>
    ),
    [watchAll]
  );

  return (
    <ModalBase
      onClose={onClose}
      visible={visible}
      Header={Header}
      childrenBottom={Footer()}
      hideMainSeparator
    >
      <View style={styles.container}>
        <Separator />
        <SpacerColumn size={2.5} />
        <View style={styles.stakeWarningContainer}>
          <SVG width={24} height={24} source={warningTriangleSVG} />
          <SpacerRow size={3} />

          <View>
            <BrandText style={fontSemibold13}>
              Staking will lock your funds for 14 days
            </BrandText>
            <SpacerColumn size={0.5} />
            <View style={styles.warningDescriptionContainer}>
              <BrandText style={styles.alternateText}>
                Once you undelegate your staked {toriDisplayDenom}, you will
                need to wait 14 days for your tokens to be liquid.
              </BrandText>
            </View>
          </View>
        </View>
        <SpacerColumn size={2.5} />
        <TextInputCustom<StakeFormValuesType>
          name="validatorName"
          control={control}
          variant="labelOutside"
          label="Validator Name"
          defaultValue="Allnodes.com ⚡️ Lowest fees"
          disabled
          rules={{ required: true }}
        />
        <SpacerColumn size={2.5} />
        <TextInputCustom<StakeFormValuesType>
          name="amount"
          variant="labelOutside"
          label="Amount"
          control={control}
          placeHolder="0"
          onlyNumbers
          defaultValue=""
          rules={{ required: true, max: MAX_VALUE }}
        >
          <Pressable
            onPress={() =>
              setValue("amount", numberWithThousandsSeparator(MAX_VALUE), {
                shouldValidate: true,
              })
            }
          >
            <BrandText style={styles.maxText}>max</BrandText>
          </Pressable>
        </TextInputCustom>
        <SpacerColumn size={1} />

        <BrandText style={fontSemibold13}>
          Available balance: {numberWithThousandsSeparator(MAX_VALUE)} [$$$]
        </BrandText>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 446,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: layout.padding_x2_5,
  },
  stakeWarningContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: errorColor,
    borderRadius: layout.borderRadius * 0.65,
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x3,
  },
  alternateText: {
    ...StyleSheet.flatten(fontSemibold12),
    color: neutral77,
    flexShrink: 1,
  },
  warningDescriptionContainer: {
    flexDirection: "row",
    width: "55%",
  },
  maxText: {
    ...StyleSheet.flatten(fontSemibold12),
    backgroundColor: primaryColor,
    color: neutral22,
    borderRadius: layout.borderRadius,
    paddingHorizontal: layout.padding_x0_5,
  },
});
