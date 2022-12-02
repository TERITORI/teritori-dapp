import React from "react";
import { Image, StyleSheet, View } from "react-native";

import defaultBreedingGuardianPNG from "../../../../assets/default-images/default-breeding-guardian.png";
import firePNG from "../../../../assets/game/fire.png";
import { BrandText } from "../../../components/BrandText";
import { CollectionSocialButtons } from "../../../components/collections/CollectionSocialButtons";
import Row from "../../../components/grid/Row";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { mineShaftColor, neutral77 } from "../../../utils/style/colors";
import { flex } from "../../../utils/style/flex";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { THE_RIOT_COLLECTION_ID } from "../settings";

type BreedingResultModalProps = {
  visible?: boolean;
  onClose?(): void;
};

export const BreedingResultModal: React.FC<BreedingResultModalProps> = ({
  visible = false,
  onClose,
}) => {
  const { info = {} } = useCollectionInfo(THE_RIOT_COLLECTION_ID);

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

          <Row style={[layout.w_100, flex.justifyContentBetween]}>
            <CollectionSocialButtons collectionInfo={info} />
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
});
