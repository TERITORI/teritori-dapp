import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import defaultSendToFightPNG from "../../../assets/default-images/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../components/spacer";
import { neutral00, neutralA3 } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium32,
  fontSemibold28,
  fontMedium14,
} from "../../utils/style/fonts";
import EnrollStat from "./component/EnrollStat";
import RipperSlot from "./component/RipperSlot";
import SimpleButton from "./component/SimpleButton";
import RipperSelectorModal from "./component/RipperSelectorModal";
import useRippers from "../../hooks/riotGame/useRippers";


export const RiotGameEnrollScreen = () => {
  const { width } = useWindowDimensions();
  const { myRippers, selectedRippers } = useRippers();
  const [selectedSlot, setSelectedSlot] = useState<number>();

  const showRipperSelector = (slotId: number) => {
    setSelectedSlot(slotId);
  }

  const hideRipperSelector = () => {
    setSelectedSlot(undefined);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.stats}>
        <EnrollStat title="Number of Fighters" content="833 Rippers" />
        <EnrollStat title="Prize Pool" content="1337 TORI" />
        <EnrollStat title="Rank" content="42/1337" />
      </View>

      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <View
        style={[
          styles.enrollContainer,
          { flexDirection: width > 992 ? "row" : "column" },
        ]}
      >
        <View style={styles.col}>
          <BrandText style={styles.sectionTitle}>
            Enroll your Ripper(s)
          </BrandText>

          <FlatList
            data={myRippers}
            numColumns={3}
            renderItem={({ item, index }) => (
              <View style={styles.ripperSlot}>
                <RipperSlot
                  key={item.id}
                  isLeader={index === 0}
                  ripper={item}
                  onPress={() => showRipperSelector(item.id)}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.col}>
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

          <Image source={defaultSendToFightPNG} style={styles.placeholderVideo} />
        </View>
      </View>

      <SimpleButton style={styles.submitBtn} title="Join the Fight" />
      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        onClose={hideRipperSelector}
        slotId={selectedSlot}
        myRippers={myRippers}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
  stats: {
    flexDirection: "row",
    margin: 10,
  },
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
    marginBottom: 40
  }
});
