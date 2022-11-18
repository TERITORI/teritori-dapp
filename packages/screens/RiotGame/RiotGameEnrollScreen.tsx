import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

import sendToFightPNG from "../../../assets/game/send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { neutral00, neutralA3, yellowDefault } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium32,
  fontSemibold28,
  fontMedium14,
} from "../../utils/style/fonts";
import { EnrollStat } from "./component/EnrollStat";
import { RipperSlot } from "./component/RipperSlot";

const rippers = [
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
  {
    id: 1,
    stamina: 1,
    protection: 1,
    luck: 1,
  },
];

export const RiotGameEnrollScreen = () => {
  return (
    <View style={styles.container}>
      <RiotGameHeader />

      <View style={styles.statsSection}>
        <EnrollStat title="Number of Fighters" content="833 Rippers" />
        <EnrollStat title="Prize Pool" content="1337 TORI" />
        <EnrollStat title="Rank" content="42/1337" />
      </View>

      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <View style={styles.enrollContainer}>
        <View style={styles.col}>
          <BrandText style={fontMedium32}>Enroll your Ripper(s)</BrandText>

          <FlatList
            data={rippers}
            numColumns={3}
            renderItem={({ item, index }) => (
              <View style={styles.ripperSlot}>
                <RipperSlot
                  key={item.id}
                  isLeader={index === 0}
                  ripper={item}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.col}>
          <BrandText style={fontMedium32}>Staking duration</BrandText>

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

          <Image source={sendToFightPNG} style={styles.placeholderVideo} />
        </View>
      </View>

      <PrimaryButton
        style={styles.submitBtn}
        color={yellowDefault}
        text="Join the Fight"
        size="M"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
  statsSection: {
    flexDirection: "row",
    margin: 10,
  },
  col: {
    // flex: 1,
  },
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  enrollContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  submitBtn: {
    marginTop: 40,
    alignSelf: "center",
  },
  placeholderVideo: {
    marginTop: 20,
    alignSelf: "center",
    width: 420,
    height: 240,
  },
});
