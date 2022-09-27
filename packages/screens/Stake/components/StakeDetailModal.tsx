import React, { useCallback } from "react";
import styled from "styled-components/native";

import { Avatar } from "../../../components/Avatar";
import { BrandText } from "../../../components/BrandText";
import { GradientText } from "../../../components/GradientText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { DivColumn, DivRow } from "../../../components/div";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { genericStyles } from "../../../utils/style/genericStyles";
import { TEMP_IMAGE } from "../../../utils/variables";
import { StakeType } from "../types";

interface StakeDetailModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: StakeType;
  onPressDelegate?: () => void;
}

export const StakeDetailModal: React.FC<StakeDetailModalProps> = ({
  onClose,
  visible,
  data,
  onPressDelegate,
}) => {
  // returns
  const Header = useCallback(
    () => (
      <>
        <DivRow style={genericStyles.jcAiCenter}>
          <Avatar size="medium" uri={TEMP_IMAGE} />
          <SpacerRow size={0.5} />
          <DivColumn>
            <MainText style={fontSemibold20}>{data?.name}</MainText>
            <SpacerColumn size={0.5} />
            <DivRow>
              <AlternateText style={fontSemibold16}>Commission</AlternateText>
              <SpacerRow size={1} />
              <GradientText style={fontSemibold16}>
                {data?.commission}
              </GradientText>
            </DivRow>
          </DivColumn>
        </DivRow>
      </>
    ),
    [data]
  );

  const Footer = useCallback(
    () => (
      <>
        <Separator />
        <FooterRow>
          <PrimaryButton size="SM" text="Close" onPress={onClose} />
          <SpacerRow size={0.5} />
          <SecondaryButton size="SM" text="Undelegate" />
          <SpacerRow size={0.5} />
          <SecondaryButton size="SM" text="Redelegate" />
          <SpacerRow size={0.5} />
          <SecondaryButton
            size="SM"
            text="Delegate"
            onPress={onPressDelegate}
          />
        </FooterRow>
      </>
    ),
    [visible]
  );

  return (
    <ModalBase
      label=""
      onClose={onClose}
      visible={visible}
      Header={Header}
      childrenBottom={Footer()}
      hideMainSeparator
    >
      <Container>
        <Separator />
        <SpacerColumn size={2.5} />
        <AlternateText style={fontSemibold14}>Website</AlternateText>
        <SpacerColumn size={2} />
        <MainText style={fontSemibold16}>{data?.website}</MainText>
        <SpacerColumn size={2.5} />
        <AlternateText style={fontSemibold14}>Description</AlternateText>
        <SpacerColumn size={2} />
        <MainText style={fontSemibold16}>{data?.description}</MainText>
        <SpacerColumn size={2.5} />
      </Container>
    </ModalBase>
  );
};

const FooterRow = styled(DivRow)(({ theme: { layout } }) => ({
  padding: layout.padding_x2_5,
}));

const Container = styled.View({
  width: 446,
});

const MainText = styled(BrandText)(({ theme: { colors } }) => ({}));

const AlternateText = styled(BrandText)(({ theme: { colors } }) => ({
  color: colors.neutral77,
  flexShrink: 1,
}));
