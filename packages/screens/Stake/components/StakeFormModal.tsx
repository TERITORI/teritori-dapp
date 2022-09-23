import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
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
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { genericStyles } from "../../../utils/style/genericStyles";
import { StakeType } from "../types";

interface StakeFormModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: StakeType;
}

export const StakeFormModal: React.FC<StakeFormModalProps> = ({
  onClose,
  visible,
  data,
}) => {
  // returns
  const Header = useCallback(
    () => (
      <DivColumn>
        <MainText style={fontSemibold20}>Stake Tokens</MainText>
        <SpacerColumn numberOfSpaces={0.1} />
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
          <SecondaryButton size="SM" text="Cancel" />
          <SpacerRow numberOfSpaces={0.5} />
          <PrimaryButton size="SM" text="Stake" />
        </FooterRow>
      </>
    ),
    []
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
        <SpacerColumn numberOfSpaces={0.625} />
        <StakeWarningContainer>
          <SVG width={24} height={24} source={warningTriangleSVG} />
          <SpacerRow numberOfSpaces={0.75} />

          <DivColumn>
            <MainText style={fontSemibold13}>
              Staking will lock your funds for 14 days
            </MainText>
            <SpacerColumn numberOfSpaces={0.1} />
            <WarningDescriptionContainer>
              <AlternateText style={fontSemibold12}>
                Once you undelegate your staked STARS, you will need to wait 14
                days for your tokens to be liquid.
              </AlternateText>
            </WarningDescriptionContainer>
          </DivColumn>
        </StakeWarningContainer>
        <SpacerColumn numberOfSpaces={0.625} />
        {/* <TextInputCustom
          label="Validator Name"
          placeHolder="Allnodes.com ⚡️ Lowest fees"
        />
        <TextInputCustom label="Amount" placeHolder="0" />

        <MainText>Available balance: 435,544,34 [$$$]</MainText> */}
      </Container>
    </ModalBase>
  );
};

const FooterRow = styled(DivRow)(({ theme: { layout } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  width: "100%",
  padding: layout.padding * 0.625,
}));

const StakeWarningContainer = styled.View(({ theme: { layout, colors } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenter),
  borderWidth: 1,
  borderColor: colors.error,
  borderRadius: layout.borderRadius * 0.65,
  paddingVertical: layout.padding * 0.375,
  paddingHorizontal: layout.padding * 0.75,
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
