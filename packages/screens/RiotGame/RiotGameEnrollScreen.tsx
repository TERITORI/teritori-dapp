import React, { useState, useMemo } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { SpacerColumn } from "../../components/spacer";
import useRippers from "../../hooks/riotGame/useRippers";
import { useAppNavigation } from "../../utils/navigation";
import { neutralA3 } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium32,
  fontSemibold28,
  fontMedium14,
} from "../../utils/style/fonts";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperSelectorModal";
import { RipperSlot } from "./component/RipperSlot";
import { SimpleButton } from "./component/SimpleButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];

export const RiotGameEnrollScreen = () => {
  const navigation = useAppNavigation();
  const { myRippers } = useRippers();
  const [selectedSlot, setSelectedSlot] = useState<number>();

  const [selectedRippers, setSelectedRippers] = useState<{
    [slotId: string]: NSRiotGame.Ripper;
  }>({});

  const availableRippers = useMemo(() => {
    const selectedIds = Object.values(selectedRippers).map((r) => r.id);
    return myRippers.filter((r) => !selectedIds.includes(r.id));
  }, [myRippers, selectedRippers]);

  const showRipperSelector = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const hideRipperSelector = () => {
    setSelectedSlot(undefined);
  };

  const onSelectRipper = (slotId: number, ripper: NSRiotGame.Ripper) => {
    setSelectedSlot(undefined);
    setSelectedRippers({ ...selectedRippers, [slotId]: ripper });
  };

  const gotoFight = () => {
    navigation.navigate("RiotGameFight");
  };

  return (
    <GameContentView>
      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <Row breakpoint={992} style={styles.enrollContainer}>
        <Col style={styles.col}>
          <BrandText style={styles.sectionTitle}>
            Enroll your Ripper(s)
          </BrandText>

          <FlatList
            scrollEnabled={false}
            data={RIPPER_SLOTS}
            numColumns={3}
            renderItem={({ item: slotId }) => (
              <View style={styles.ripperSlot}>
                <RipperSlot
                  key={slotId}
                  isLeader={slotId === 0}
                  ripper={selectedRippers[slotId]}
                  onPress={() => showRipperSelector(slotId)}
                />
              </View>
            )}
          />
        </Col>

        <Col style={styles.col}>
          <BrandText style={styles.sectionTitle}>Staking duration</BrandText>

          <TertiaryBox
            mainContainerStyle={{
              padding: 40,
              alignItems: "flex-start",
            }}
            style={styles.countdownBlock}
            height={148}
          >
            <BrandText style={fontSemibold28}>
              23 hours 21 minutes 23 seconds
            </BrandText>

            <SpacerColumn size={1} />

            <BrandText style={styles.subText}>
              Stamina x 0.2 for solo fightsLeader's
            </BrandText>
            <BrandText style={styles.subText}>
              Leader's Stamina x 0.2 + Bonus for squad fights
            </BrandText>
          </TertiaryBox>

          <Image
            source={defaultSendToFightPNG}
            style={styles.placeholderVideo}
          />
        </Col>
      </Row>

      <SimpleButton
        onPress={gotoFight}
        containerStyle={styles.submitBtn}
        title="Join the Fight"
      />

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        onClose={hideRipperSelector}
        slotId={selectedSlot}
        availableRippers={availableRippers}
        onSelectRipper={onSelectRipper}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  sectionTitle: {
    marginTop: 10,
    ...(fontMedium32 as object),
  },
  enrollContainer: {
    justifyContent: "space-around",
    marginTop: 10,
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
  },
  ripperSlot: {
    marginRight: 20,
    marginTop: 20,
  },
  countdownBlock: {
    marginTop: 20,
  },
  subText: {
    color: neutralA3,
    ...(fontMedium14 as object),
  },
  placeholderVideo: {
    marginTop: 20,
    alignSelf: "center",
    width: 420,
    height: 240,
  },
  submitBtn: {
    marginVertical: 40,
  },
});
