import React from "react";
import { Image, StyleSheet, View } from "react-native";

import defaultBreedingGuardianPNG from "../../../../assets/default-images/default-breeding-guardian.png";
import firePNG from "../../../../assets/game/fire.png";
import discordSVG from "../../../../assets/icons/discord.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import { SocialButton } from "../../../components/buttons/SocialButton";
import Row from "../../../components/grid/Row";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { mineShaftColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";

type BreedingModalProps = {
  visible?: boolean;
  onClose?(): void;
};

export const BreedingModal: React.FC<BreedingModalProps> = ({
  visible = false,
  onClose,
}) => {
  return (
    <ModalBase
      contentStyle={{ alignItems: "center" }}
      label={
        <Row>
          <BrandText style={fontSemibold20}>Success Breeding</BrandText>
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

          <Row style={styles.socialContainer}>
            <SocialButton
              noBrokenCorners={false}
              iconSvg={discordSVG}
              text="Discord"
            />
            <SocialButton
              noBrokenCorners={false}
              iconSvg={websiteSVG}
              text="Website"
            />
            <SocialButton
              noBrokenCorners={false}
              iconSvg={twitterSVG}
              text="Twitter"
            />
          </Row>
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 330, height: 330 }}
          source={defaultBreedingGuardianPNG}
        />

        <SpacerColumn size={2} />

        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          You successfully recruited a new Ripper
        </BrandText>

        <SpacerColumn size={0.5} />

        <BrandText style={fontSemibold20}>#230</BrandText>

        <SpacerColumn size={2} />
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
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  socialContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
});
