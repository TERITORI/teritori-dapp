import { coin } from "cosmwasm";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import breedSVG from "../../../assets/game/breed.svg";
import chevronDownLineSVG from "../../../assets/game/chevron-down-line.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import Row from "../../components/grid/Row";
import { SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBreeding } from "../../hooks/riotGame/useBreeding";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { prettyPrice } from "../../utils/coins";
import { getRipperTokenId } from "../../utils/game";
import { neutral33, neutralA3, yellowDefault } from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import { fontMedium14, fontMedium48 } from "../../utils/style/fonts";
import { spacing } from "../../utils/style/spacing";
import { BreedingResultModal } from "./component/BreedingResultModal";
import { BreedingSlot } from "./component/BreedingSlot";
import { GameContentView } from "./component/GameContentView";
import { InfoBox } from "./component/InfoBox";
import { RipperSelectorModal } from "./component/RipperSelectorModal";

export const RiotGameBreedingScreen = () => {
  const { myAvailableRippers } = useRippers();
  const [isShowBreedingResultModal, setIsShowBreedingResultModal] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [isBreeding, setIsBreeding] = useState(false);
  const { setToastError } = useFeedbacks();

  const [selectedRippers, setSelectedRippers] = useState<{
    [slotId: string]: NSRiotGame.RipperDetail;
  }>({});

  const { breedingConfig, breed, lastBreedAt } = useBreeding();

  const availableRippers = useMemo(() => {
    const selectedIds = Object.values(selectedRippers).map((r) => r.tokenId);

    const res = myAvailableRippers.filter(
      (r) => !selectedIds.includes(getRipperTokenId(r))
    );

    return res;
  }, [myAvailableRippers, selectedRippers]);

  const doBreed = async () => {
    if (!breedingConfig) {
      return setToastError({
        title: "Error",
        message: "Failed to load BreedingConfig",
      });
    }

    setIsBreeding(true);

    try {
      await breed(
        coin(
          breedingConfig.breed_price_amount,
          breedingConfig.breed_price_denom
        ),
        selectedRippers[0]?.tokenId,
        selectedRippers[1]?.tokenId,
        breedingConfig.parent_contract_addr
      );

      setIsShowBreedingResultModal(true);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setToastError({
          title: "Error occurs",
          message: e.message,
        });
      }
    } finally {
      setIsBreeding(false);
    }
  };

  const openSelectorModal = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const selectRipper = (slotId: number, ripper: NSRiotGame.RipperDetail) => {
    setSelectedSlot(undefined);
    setSelectedRippers({ ...selectedRippers, [slotId]: ripper });
  };

  return (
    <GameContentView>
      <View style={[spacing.mt_5, flex.alignCenter]}>
        <BrandText style={[fontMedium48]}>Breeding</BrandText>

        <Row style={[spacing.mt_5, flex.justifyContentCenter]}>
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

        <Row style={spacing.mt_5}>
          <InfoBox
            size="LG"
            title="Price"
            content={prettyPrice(
              process.env.TERITORI_NETWORK_ID || "",
              breedingConfig?.breed_price_amount || "",
              breedingConfig?.breed_price_denom || ""
            )}
            width={180}
          />
          <InfoBox
            size="LG"
            title="Breeding Cooldown"
            content="00:00 AM"
            width={180}
          />

          <InfoBox size="LG" title="Bonus" content="Coming soon" width={180} />
        </Row>

        <View style={spacing.mt_2}>
          <SVG source={chevronDownLineSVG} color={neutral33} />
        </View>

        <ButtonOutline
          disabled={isBreeding || Object.keys(selectedRippers).length !== 2}
          onPress={doBreed}
          color={yellowDefault}
          size="M"
          text={isBreeding ? "Breeding..." : "Breed my Rippers"}
          iconSVG={breedSVG}
          style={spacing.mt_2}
        />

        <BrandText style={[fontMedium14, spacing.mt_2, { color: neutralA3 }]}>
          Legal phrase powered by Popipou
        </BrandText>
      </View>

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        confirmButton="Add to Breeding"
        slotId={selectedSlot}
        availableRippers={availableRippers}
        onSelectRipper={selectRipper}
        onClose={() => setSelectedSlot(undefined)}
      />

      <BreedingResultModal
        lastBreedAt={lastBreedAt}
        breedingConfig={breedingConfig}
        onClose={() => setIsShowBreedingResultModal(false)}
        visible={isShowBreedingResultModal}
      />
    </GameContentView>
  );
};
