import React from "react";
import { Image, StyleSheet, View } from "react-native";

import firePNG from "../../../../assets/game/fire.png";
import trophiesSVG from "../../../../assets/game/trophies.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import teritoriLogoSVG from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SocialButton } from "../../../components/buttons/SocialButton";
import Row from "../../../components/grid/Row";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  mineShaftColor,
  neutral77,
  neutralA3,
} from "../../../utils/style/colors";
import { flex } from "../../../utils/style/flex";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";

type ClaimModalProps = {
  visible?: boolean;
  onClose?(): void;
};

export const ClaimModal: React.FC<ClaimModalProps> = ({
  visible = false,
  onClose,
}) => {
  return (
    <ModalBase
      contentStyle={{ alignItems: "center" }}
      label={
        <Row>
          <BrandText style={fontSemibold20}>Success Fight !</BrandText>
          <Image
            style={{ width: 24, height: 24, marginLeft: 5 }}
            source={firePNG}
          />
        </Row>
      }
      visible={visible}
      width={372}
      onClose={onClose}
      childrenBottom={
        <View style={styles.footer}>
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            Share with friends via
          </BrandText>

          <SpacerColumn size={2} />

          <SocialButton
            noBrokenCorners={false}
            iconSvg={twitterSVG}
            text="Twitter"
          />
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SVG width={200} height={200} source={teritoriLogoSVG} />

        <SpacerColumn size={4} />

        <BrandText style={fontSemibold20}>ferryman.tori</BrandText>

        <SpacerColumn size={2} />

        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          You made it to rank #1!
        </BrandText>

        <SpacerColumn size={2} />

        <Row style={flex.justifyContentCenter}>
          <SVG color={neutralA3} width={24} height={24} source={trophiesSVG} />

          <SpacerRow size={1} />

          <BrandText style={fontSemibold20}>1337 TORI</BrandText>
        </Row>

        <SpacerColumn size={4} />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: mineShaftColor,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
});
