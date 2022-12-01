import React from "react";
import { StyleSheet, ImageBackground, FlatList } from "react-native";

import jumbotronPNG from "../../../assets/game/leaderboard-jumbotron.png";
import cryptoLogoSVG from "../../../assets/icons/crypto-logo.svg";
import logoSVG from "../../../assets/logos/logo-white.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { spacing } from "../../utils/style/spacing";
import { GameContentView } from "./component/GameContentView";

export const RiotGameLeaderboardScreen = () => {
  return (
    <GameContentView hideStats contentStyle={styles.contentContainer}>
      <ImageBackground style={styles.jumbotron} source={jumbotronPNG}>
        <SVG style={{ width: 66, height: 72 }} source={logoSVG} />

        <SpacerColumn size={2} />

        <BrandText style={fontSemibold28}>THE R!OT LEADERBOARD</BrandText>
      </ImageBackground>

      <TertiaryBox fullWidth style={spacing.mt_2}>
        <Row>
          <Col size={1}>
            <BrandText style={[styles.colHeaderTitle, spacing.ml_2]}>
              Rank
            </BrandText>
          </Col>
          <Col size={5}>
            <BrandText style={styles.colHeaderTitle}>Player</BrandText>
          </Col>
          <Col size={2}>
            <BrandText style={styles.colHeaderTitle}>
              Current Fight XP
            </BrandText>
          </Col>
          <Col size={2}>
            <BrandText style={styles.colHeaderTitle}>
              Time spent in Fight
            </BrandText>
          </Col>
          <Col size={2}>
            <BrandText style={styles.colHeaderTitle}>24 hours Change</BrandText>
          </Col>
        </Row>
      </TertiaryBox>

      <FlatList
        data={Array(20).fill(0)}
        renderItem={({ item, index }) => {
          return (
            <Row style={styles.rowItem}>
              <Col size={1}>
                <BrandText style={[styles.colData, spacing.ml_3]}>
                  {index + 1}
                </BrandText>
              </Col>
              <Col size={5}>
                <BrandText style={styles.colData}>Player</BrandText>
              </Col>
              <Col size={2} style={[flex.flexRow, flex.alignItemsCenter]}>
                <SVG style={{ width: 24, height: 24 }} source={cryptoLogoSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>Current Fight XP</BrandText>
              </Col>
              <Col size={2} style={[flex.flexRow, flex.alignItemsCenter]}>
                <SVG style={{ width: 24, height: 24 }} source={cryptoLogoSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>
                  Time spent in Fight
                </BrandText>
              </Col>
              <Col size={2}>
                <BrandText style={styles.colData}>24 hours Change</BrandText>
              </Col>
            </Row>
          );
        }}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
  },

  jumbotron: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  colHeaderTitle: {
    color: neutral77,
    ...(fontSemibold12 as object),
    marginVertical: 14,
  },
  colData: {
    marginVertical: 20,
    ...(fontSemibold12 as object),
  },
  rowItem: {
    borderBottomWidth: 1,
    borderBottomColor: neutral33,
  },
});
