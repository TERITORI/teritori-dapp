import React from "react";
import { Image, StyleSheet, View } from "react-native";

import firePNG from "../../../../assets/game/fire.png";
import trophiesSVG from "../../../../assets/icons/trophies.svg";
import teritoriLogoSVG from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { tinyAddress } from "../../../components/WalletSelector";
import { CollectionSocialButtons } from "../../../components/collections/CollectionSocialButtons";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { GetSquadResponse } from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../../hooks/useTNSMetadata";
import { durationToXP } from "../../../utils/game";
import {
  mineShaftColor,
  neutral77,
  neutralA3,
} from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { THE_RIOT_COLLECTION_ID } from "../settings";

type UnstakeModalProps = {
  visible?: boolean;
  onClose?(): void;
  currentSquad?: GetSquadResponse;
};

export const UnstakeModal: React.FC<UnstakeModalProps> = ({
  currentSquad,
  onClose,
  visible = false,
}) => {
  const selectedWallet = useSelectedWallet();
  const { info = {} } = useCollectionInfo(THE_RIOT_COLLECTION_ID);
  const tnsMetadata = useTNSMetadata(selectedWallet?.address);

  const startTime = currentSquad?.start_time || 0;
  const endTime = currentSquad?.end_time || 0;
  const xp = durationToXP(endTime - startTime);

  return (
    <ModalBase
      contentStyle={{ alignItems: "center" }}
      labelComponent={
        <FlexRow>
          <BrandText style={fontSemibold20}>Success Fight !</BrandText>
          <Image
            style={{ width: 24, height: 24, marginLeft: layout.padding_x0_5 }}
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

          <FlexRow style={{ width: "100%", justifyContent: "space-between" }}>
            <CollectionSocialButtons collectionInfo={info} />
          </FlexRow>
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SVG width={200} height={200} source={teritoriLogoSVG} />

        <SpacerColumn size={4} />

        <BrandText style={fontSemibold20}>
          {tinyAddress(
            tnsMetadata?.metadata?.tokenId || selectedWallet?.address || ""
          )}
        </BrandText>

        <SpacerColumn size={2} />

        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          You made it
        </BrandText>

        <SpacerColumn size={2} />

        <FlexRow style={{ justifyContent: "center" }}>
          <SVG color={neutralA3} width={24} height={24} source={trophiesSVG} />

          <SpacerRow size={1} />

          <BrandText style={fontSemibold20}>{xp} XP</BrandText>
        </FlexRow>

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
    padding: layout.padding_x2_5,
  },
});
