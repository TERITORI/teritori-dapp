import React from "react";
import { Image, Linking, StyleSheet, View } from "react-native";

import firePNG from "../../../../assets/game/fire.png";
import trophiesSVG from "../../../../assets/icons/trophies.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import teritoriLogoSVG from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { tinyAddress } from "../../../components/WalletSelector";
import { SocialButton } from "../../../components/buttons/SocialButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { Squad } from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { useGameRewards } from "../../../hooks/riotGame/useGameRewards";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../../hooks/useTNSMetadata";
import { decimalFromAtomics } from "../../../utils/coins";
import { durationToXP } from "../../../utils/game";
import {
  mineShaftColor,
  neutral77,
  neutralA3,
} from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type UnstakeModalProps = {
  visible?: boolean;
  onClose?(): void;
  squad?: Squad;
};

export const UnstakeModal: React.FC<UnstakeModalProps> = ({
  squad,
  onClose,
  visible = false,
}) => {
  const selectedWallet = useSelectedWallet();
  const { claimableAmount } = useGameRewards();
  const networkId = useSelectedNetworkId();
  const tnsMetadata = useTNSMetadata(selectedWallet?.address);

  const startTime = squad?.start_time || 0;
  const endTime = squad?.end_time || 0;
  const xp = durationToXP(endTime - startTime);

  const onPressTwitter = () => {
    const twitterShareMessage = `Join The R!ot now ⛩️\nI played and earned ${decimalFromAtomics(
      networkId,
      "" + claimableAmount,
      "utori"
    )} $TORI!\nSee you on the battlefield: https://app.teritori.com/riot-game`;
    const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterShareMessage
    )}`;
    Linking.openURL(twitterShareLink);
  };

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

          <FlexRow style={{ width: "100%", justifyContent: "center" }}>
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
        <SVG width={200} height={200} source={teritoriLogoSVG} />

        <SpacerColumn size={4} />

        <BrandText style={fontSemibold20}>
          {tinyAddress(
            tnsMetadata.metadata?.tokenId || selectedWallet?.address || ""
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
