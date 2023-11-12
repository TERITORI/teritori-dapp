import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import validatorIconSVG from "../../../../assets/default-images/validator-icon.svg";
import { Avatar } from "../../../components/Avatar";
import { BrandText } from "../../../components/BrandText";
import { ExternalLink } from "../../../components/ExternalLink";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { GradientText } from "../../../components/gradientText";
import ModalBase from "../../../components/modals/ModalBase";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useKeybaseAvatarURL } from "../../../hooks/useKeybaseAvatarURL";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ValidatorInfo } from "../types";

interface StakeDetailModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: ValidatorInfo;
  onPressDelegate?: () => void;
  onPressUndelegate?: () => void;
  onPressRedelegate?: () => void;
}

export const StakeDetailModal: React.FC<StakeDetailModalProps> = ({
  onClose,
  visible,
  data,
  onPressDelegate,
  onPressUndelegate,
  onPressRedelegate,
}) => {
  const imageURL = useKeybaseAvatarURL(data?.identity || "");
  const Header = useCallback(
    () => (
      <>
        <View style={styles.rowWithCenter}>
          <Avatar size="medium" uri={imageURL} defaultIcon={validatorIconSVG} />
          <SpacerRow size={2} />
          <View>
            <BrandText style={fontSemibold20}>{data?.moniker}</BrandText>
            <SpacerColumn size={0.5} />
            <View style={styles.rowWithCenter}>
              <BrandText style={[styles.alternateText, fontSemibold16]}>
                Commission
              </BrandText>
              <SpacerRow size={1} />
              <GradientText gradientType="blueExtended">
                {data?.commission}
              </GradientText>
            </View>
          </View>
        </View>
      </>
    ),
    [data, imageURL],
  );

  const Footer = useCallback(
    () => (
      <>
        <Separator />
        <View style={styles.footerRow}>
          <PrimaryButton size="SM" text="Close" onPress={onClose} />
          <SpacerRow size={2} />
          <SecondaryButton
            size="SM"
            text="Undelegate"
            onPress={onPressUndelegate}
          />
          <SpacerRow size={2} />
          <SecondaryButton
            size="SM"
            text="Redelegate"
            onPress={onPressRedelegate}
          />
          <SpacerRow size={2} />
          <SecondaryButton
            size="SM"
            text="Delegate"
            onPress={onPressDelegate}
          />
        </View>
      </>
    ),
    [onClose, onPressDelegate, onPressRedelegate, onPressUndelegate],
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
        {!!data?.website && (
          <>
            <BrandText style={[styles.alternateText, fontSemibold14]}>
              Website
            </BrandText>
            <SpacerColumn size={0.5} />
            <ExternalLink externalUrl={data.website} style={fontSemibold16}>
              {data.website}
            </ExternalLink>
            <SpacerColumn size={2.5} />
          </>
        )}
        <BrandText style={[styles.alternateText, fontSemibold14]}>
          Description
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={fontSemibold16}>{data?.description || ""}</BrandText>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: layout.spacing_x2_5,
  },
  container: {
    width: 446,
  },
  alternateText: { color: neutral77, flexShrink: 1 },
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
});
