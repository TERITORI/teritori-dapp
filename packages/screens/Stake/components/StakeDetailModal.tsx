import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { Avatar } from "../../../components/Avatar";
import { BrandText } from "../../../components/BrandText";
import { GradientText } from "../../../components/GradientText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { DivColumn, DivRow } from "../../../components/div";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { TEMP_IMAGE } from "../../../utils/faking";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { genericStyles } from "../../../utils/style/genericStyles";
import { layout } from "../../../utils/style/layout";
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
        <DivRow>
          <Avatar size="medium" uri={TEMP_IMAGE} />
          <SpacerRow size={2} />
          <DivColumn>
            <BrandText style={fontSemibold20}>{data?.name}</BrandText>
            <SpacerColumn size={0.5} />
            <DivRow>
              <BrandText style={[styles.alternateText, fontSemibold16]}>
                Commission
              </BrandText>
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
        <View style={styles.footerRow}>
          <PrimaryButton size="SM" text="Close" onPress={onClose} />
          <SpacerRow size={2} />
          <SecondaryButton size="SM" text="Undelegate" />
          <SpacerRow size={2} />
          <SecondaryButton size="SM" text="Redelegate" />
          <SpacerRow size={2} />
          <SecondaryButton
            size="SM"
            text="Delegate"
            onPress={onPressDelegate}
          />
        </View>
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
      <View style={styles.container}>
        <Separator />
        <SpacerColumn size={2.5} />
        <BrandText style={[styles.alternateText, fontSemibold14]}>
          Website
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={fontSemibold16}>{data?.website}</BrandText>
        <SpacerColumn size={2.5} />
        <BrandText style={[styles.alternateText, fontSemibold14]}>
          Description
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={fontSemibold16}>{data?.description}</BrandText>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  footerRow: {
    ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
    padding: layout.padding_x2_5,
  },
  container: {
    width: 446,
  },
  alternateText: { color: neutral77, flexShrink: 1 },
});
