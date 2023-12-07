import React from "react";
import { Image, Linking, StyleSheet, View } from "react-native";

import firePNG from "../../../../assets/game/fire.png";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SocialButton } from "../../../components/buttons/SocialButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { mineShaftColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export type TokenInfo = {
  id: string;
  imageUri: string;
};

type BreedingResultModalProps = {
  visible: boolean;
  onClose(): void;
  tokenInfo: TokenInfo | undefined;
};

export const BreedingResultModal: React.FC<BreedingResultModalProps> = ({
  visible = false,
  tokenInfo,
  onClose,
}) => {
  const onPressTwitter = () => {
    if (!tokenInfo?.id) return;

    const twitterShareMessage = `Another one ⛩️️\nI just recruited this new Ripper ${tokenInfo.id} in my squad!\nJoin the fight: https://app.teritori.com/riot-game`;
    const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterShareMessage,
    )}`;
    Linking.openURL(twitterShareLink);
  };
  return (
    <ModalBase
      boxStyle={{ alignItems: "center" }}
      labelComponent={
        <FlexRow>
          <BrandText style={fontSemibold20}>Success Breeding</BrandText>
          <Image
            style={{ width: 24, height: 24, marginLeft: 5 }}
            source={firePNG}
          />
        </FlexRow>
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

          <FlexRow justifyContent="center">
            <SocialButton
              text="Twitter"
              iconSvg={twitterSVG}
              onPress={onPressTwitter}
            />
          </FlexRow>
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        <OptimizedImage
          style={{ width: 330, height: 330 }}
          sourceURI={tokenInfo?.imageUri}
          width={330}
          height={330}
        />

        <SpacerColumn size={2} />

        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          {!tokenInfo
            ? "Loading..."
            : "You successfully recruited a new Ripper"}
        </BrandText>

        <SpacerColumn size={0.5} />

        <BrandText style={fontSemibold20}>#{tokenInfo?.id}</BrandText>

        <SpacerColumn size={2} />
      </View>
    </ModalBase>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: mineShaftColor,
    width: "100%",
    alignItems: "center",
    paddingVertical: layout.spacing_x2_5,
    paddingHorizontal: layout.spacing_x1_5,
  },
});
