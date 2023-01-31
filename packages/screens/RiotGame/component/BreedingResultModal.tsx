import React from "react";
import { Image, StyleSheet, View } from "react-native";

import firePNG from "../../../../assets/game/fire.png";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { CollectionSocialButtons } from "../../../components/collections/CollectionSocialButtons";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { mineShaftColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { THE_RIOT_COLLECTION_ID } from "../settings";

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
  const { info: collectionInfo = { mintPhases: [] } } = useCollectionInfo(
    THE_RIOT_COLLECTION_ID
  );

  return (
    <ModalBase
      contentStyle={{ alignItems: "center" }}
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

          <FlexRow justifyContent="space-between">
            <CollectionSocialButtons collectionInfo={collectionInfo} />
          </FlexRow>
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 330, height: 330 }}
          source={{ uri: tokenInfo?.imageUri }}
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

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: mineShaftColor,
    width: "100%",
    alignItems: "center",
    paddingVertical: layout.padding_x2_5,
    paddingHorizontal: layout.padding_x1_5,
  },
});
