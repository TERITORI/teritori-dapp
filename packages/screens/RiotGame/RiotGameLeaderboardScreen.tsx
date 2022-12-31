import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
  View,
} from "react-native";

import jumbotronPNG from "../../../assets/game/leaderboard-jumbotron.png";
import badgeSVG from "../../../assets/icons/badge.svg";
import cryptoLogoSVG from "../../../assets/icons/crypto-logo.svg";
import volDownSVG from "../../../assets/icons/vol-down.svg";
import volUpSVG from "../../../assets/icons/vol-up.svg";
import logoSVG from "../../../assets/logos/logo-white.svg";
import { LeaderboardResponse, UserScore } from "../../api/p2e/v1/p2e";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { tinyAddress } from "../../components/WalletSelector";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { p2eBackendClient } from "../../utils/backend";
import { parseUserScoreInfo } from "../../utils/game";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  additionalGreen,
  additionalRed,
  neutral33,
  neutral77,
  primaryColor,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";

type RankProps = {
  changes: number;
};
type PlayerNameProps = {
  userId: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ userId }) => {
  const address = userId.split("-")[1];
  const tnsMetadata = useTNSMetadata(address);

  const name = tinyAddress(tnsMetadata?.metadata?.tokenId || address || "");

  return (
    <FlexRow width="auto" alignItems="center">
      <Image
        source={{
          uri: ipfsURLToHTTPURL(
            tnsMetadata?.metadata?.image ||
              process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL ||
              ""
          ),
        }}
        style={{
          borderRadius: 999,
          width: 32,
          height: 32,
          aspectRatio: 1,
        }}
      />

      <BrandText style={[styles.colData, { marginLeft: layout.padding_x1 }]}>
        {name}
      </BrandText>
      <SVG
        width={16}
        height={16}
        color={primaryColor}
        source={badgeSVG}
        style={{ marginLeft: layout.padding_x1 }}
      />
    </FlexRow>
  );
};

const Rank: React.FC<RankProps> = ({ changes }) => {
  if (changes === 0) {
    return (
      <BrandText style={[styles.colData, { marginLeft: layout.padding_x3 }]}>
        0
      </BrandText>
    );
  }

  const rankColor = changes < 0 ? additionalGreen : additionalRed;
  const rankSign = changes < 0 ? "+" : "-";

  return (
    <FlexRow style={{ alignItems: "center" }}>
      <SVG source={changes < 0 ? volUpSVG : volDownSVG} />
      <BrandText
        style={[
          styles.colData,
          { color: rankColor, marginLeft: layout.padding_x1 },
        ]}
      >
        {rankSign} {Math.abs(changes)}
      </BrandText>
    </FlexRow>
  );
};

export const RiotGameLeaderboardScreen = () => {
  const [userScores, setUserScores] = useState<UserScore[]>([]);

  const fetchLeaderboard = async () => {
    const _userScores: UserScore[] = [];

    const { id } = await p2eBackendClient.CurrentSeason({});

    const streamData = await p2eBackendClient.Leaderboard({
      seasonId: id,
      limit: 500,
      offset: 0,
    });

    await streamData.forEach((item: LeaderboardResponse) => {
      item.userScore && _userScores.push(item.userScore);
    });
    setUserScores(_userScores.filter((val) => val.rank !== 0));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <GameContentView hideStats contentStyle={styles.contentContainer}>
      <ImageBackground style={styles.jumbotron} source={jumbotronPNG}>
        <SVG style={{ width: 66, height: 72 }} source={logoSVG} />

        <SpacerColumn size={2} />

        <BrandText style={fontSemibold28}>THE R!OT LEADERBOARD</BrandText>
      </ImageBackground>

      <TertiaryBox fullWidth style={{ marginTop: layout.padding_x2 }}>
        <FlexRow>
          <View style={{ flex: 1 }}>
            <BrandText
              style={[styles.colHeaderTitle, { marginLeft: layout.padding_x2 }]}
            >
              Rank
            </BrandText>
          </View>
          <View style={{ flex: 5 }}>
            <BrandText style={styles.colHeaderTitle}>Player</BrandText>
          </View>
          <View style={{ flex: 2 }}>
            <BrandText style={styles.colHeaderTitle}>
              Current Fight XP
            </BrandText>
          </View>
          <View style={{ flex: 2 }}>
            <BrandText style={styles.colHeaderTitle}>
              Time spent in Fight
            </BrandText>
          </View>
          <View style={{ flex: 1 }}>
            <BrandText style={styles.colHeaderTitle}>24 hours Change</BrandText>
          </View>
        </FlexRow>
      </TertiaryBox>

      <FlatList
        data={userScores}
        keyExtractor={(item, index) => " " + index}
        renderItem={({ item: userScore }) => {
          const { xp, hours, rankChanges } = parseUserScoreInfo(userScore);

          return (
            <FlexRow style={styles.rowItem}>
              <View style={{ flex: 1 }}>
                <BrandText
                  style={[styles.colData, { marginLeft: layout.padding_x3 }]}
                >
                  {userScore.rank}
                </BrandText>
              </View>
              <View style={{ flex: 5 }}>
                <PlayerName userId={userScore.userId} />
              </View>
              <View
                style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
              >
                <SVG style={{ width: 24, height: 24 }} source={cryptoLogoSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>{xp}</BrandText>
              </View>
              <View
                style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
              >
                <SVG style={{ width: 24, height: 24 }} source={cryptoLogoSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>{hours} hours</BrandText>
              </View>
              <View style={{ flex: 1 }}>
                <Rank changes={rankChanges} />
              </View>
            </FlexRow>
          );
        }}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: layout.padding_x2_5,
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
    marginVertical: layout.padding_x2,
  },
  colData: {
    marginVertical: layout.padding_x2_5,
    ...(fontSemibold12 as object),
  },
  rowItem: {
    borderBottomWidth: 1,
    borderBottomColor: neutral33,
  },
});
