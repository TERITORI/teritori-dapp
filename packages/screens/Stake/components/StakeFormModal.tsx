import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet } from "react-native";
import styled from "styled-components/native";

import warningTriangleSVG from "../../../../assets/icons/warning-triangle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { DivColumn, DivRow } from "../../../components/div";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { numberWithThousandsSeparator } from "../../../utils/numbers";
import {
  fontSemibold9,
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { genericStyles } from "../../../utils/style/genericStyles";
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
      <DivColumn>
        <MainText style={fontSemibold20}>Stake Tokens</MainText>
        <SpacerColumn size={0.5} />
        <AlternateText style={fontSemibold16}>
          Select a validator and amount of TORI to stake.
        </AlternateText>
      </DivColumn>
    ),
    [data]
  );

  const Footer = useCallback(
    () => (
      <>
        <Separator />
        <FooterRow>
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
        </FooterRow>
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
      <Container>
        <Separator />
        <SpacerColumn size={2.5} />
        <StakeWarningContainer>
          <SVG width={24} height={24} source={warningTriangleSVG} />
          <SpacerRow size={3} />

          <DivColumn>
            <MainText style={fontSemibold13}>
              Staking will lock your funds for 14 days
            </MainText>
            <SpacerColumn size={0.5} />
            <WarningDescriptionContainer>
              <AlternateText style={fontSemibold12}>
                Once you undelegate your staked STARS, you will need to wait 14
                days for your tokens to be liquid.
              </AlternateText>
            </WarningDescriptionContainer>
          </DivColumn>
        </StakeWarningContainer>
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
          rules={{ required: true, max: MAX_VALUE }}
        >
          <Pressable
            onPress={() =>
              setValue("amount", numberWithThousandsSeparator(MAX_VALUE), {
                shouldValidate: true,
              })
            }
          >
            <MaxText style={fontSemibold9}>max</MaxText>
          </Pressable>
        </TextInputCustom>
        <SpacerColumn size={1} />

        <MainText style={fontSemibold13}>
          Available balance: {numberWithThousandsSeparator(MAX_VALUE)} [$$$]
        </MainText>
        <SpacerColumn size={2.5} />
      </Container>
    </ModalBase>
  );
};

const FooterRow = styled(DivRow)(({ theme: { layout } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  width: "100%",
  padding: layout.padding_x2_5,
}));

const StakeWarningContainer = styled.View(({ theme: { layout, colors } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenter),
  borderWidth: 1,
  borderColor: colors.error,
  borderRadius: layout.borderRadius * 0.65,
  paddingVertical: layout.padding_x1_5,
  paddingHorizontal: layout.padding_x3,
}));

const Container = styled.View({
  width: 446,
});

const MainText = styled(BrandText)(() => ({}));

const AlternateText = styled(BrandText)(({ theme: { colors } }) => ({
  color: colors.neutral77,
  flexShrink: 1,
}));

const WarningDescriptionContainer = styled.View({
  flexDirection: "row",
  width: "55%",
});

const MaxText = styled.View(({ theme: { layout, colors } }) => ({
  backgroundColor: colors.primary,
  color: colors.neutral22,
  borderRadius: layout.borderRadius,
  paddingHorizontal: layout.padding_x0_5,
}));
