import React, { useState } from "react";
import { View } from "react-native";

import breedSVG from "../../../assets/game/breed.svg";
import chevronDownLineSVG from "../../../assets/game/chevron-down-line.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import Row from "../../components/grid/Row";
import { SpacerRow } from "../../components/spacer";
import useRippers from "../../hooks/riotGame/useRippers";
import { neutral33, neutralA3, yellowDefault } from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import { fontMedium14, fontMedium48 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BreedingModal } from "./component/BreedingModal";
import { BreedingSlot } from "./component/BreedingSlot";
import { GameContentView } from "./component/GameContentView";
import { InfoBox } from "./component/InfoBox";
import { RipperSelectorModal } from "./component/RipperSelectorModal";

export const RiotGameBreedingScreen = () => {
  const { myRippers } = useRippers();
  const [isShowBreedingModal, setIsShowBreedingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>();

  const [selectedRippers, setSelectedRippers] = useState<{
    [slotId: string]: NSRiotGame.Ripper;
  }>({});

  const doBreed = () => {
    setIsShowBreedingModal(true);
  };

  const openSelectorModal = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const selectRipper = (slotId: number, ripper: NSRiotGame.Ripper) => {
    setSelectedSlot(undefined);
    setSelectedRippers({ ...selectedRippers, [slotId]: ripper });
  };

  return (
    <GameContentView>
      <View style={[layout.mt_5, flex.alignCenter]}>
        <BrandText style={[fontMedium48]}>Breeding</BrandText>

        <Row style={[layout.mt_5, flex.justifyContentCenter]}>
          <BreedingSlot
            ripper={selectedRippers[0]}
            onPress={() => openSelectorModal(0)}
          />
          <SpacerRow size={3} />
          <BreedingSlot
            ripper={selectedRippers[1]}
            onPress={() => openSelectorModal(1)}
          />
        </Row>

        <Row style={layout.mt_5}>
          <InfoBox size="LG" title="Price" content="10 $ATOM" width={180} />

          <InfoBox
            size="LG"
            title="Breeding Cooldown"
            content="00:00 AM"
            width={180}
          />

          <InfoBox size="LG" title="Bonus" content="Coming soon" width={180} />
        </Row>

        <View style={layout.mt_2}>
          <SVG source={chevronDownLineSVG} color={neutral33} />
        </View>

        <ButtonOutline
          onPress={doBreed}
          color={yellowDefault}
          size="M"
          text="Breed my Rippers"
          iconSVG={breedSVG}
          style={layout.mt_2}
        />

        <BrandText style={[fontMedium14, layout.mt_2, { color: neutralA3 }]}>
          Legal phrase powered by Popipou
        </BrandText>
      </View>

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        slotId={selectedSlot}
        availableRippers={myRippers}
        onSelectRipper={selectRipper}
        onClose={() => setSelectedSlot(undefined)}
      />

      <BreedingModal
        onClose={() => setIsShowBreedingModal(false)}
        visible={isShowBreedingModal}
      />
    </GameContentView>
  );
};
