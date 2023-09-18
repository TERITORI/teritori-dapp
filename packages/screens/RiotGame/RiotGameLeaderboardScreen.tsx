import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";

import { GameContentView } from "./component/GameContentView";
import iconFightSVG from "../../../assets/game/icon-fight.svg";
import iconXPSVG from "../../../assets/game/icon-xp.svg";
import jumbotronPNG from "../../../assets/game/leaderboard-jumbotron.png";
import badgeSVG from "../../../assets/icons/badge.svg";
import volDownSVG from "../../../assets/icons/vol-down.svg";
import volUpSVG from "../../../assets/icons/vol-up.svg";
import logoSVG from "../../../assets/logos/logo-white.svg";
import {
  CurrentSeasonResponse,
  LeaderboardResponse,
  UserScore,
} from "../../api/p2e/v1/p2e";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { parseUserId } from "../../networks";
import { mustGetP2eClient } from "../../utils/backend";
import { parseUserScoreInfo } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import {
  additionalGreen,
  additionalRed,
  neutral33,
  neutral77,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold12,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";

type RankProps = {
  changes: number;
};
type PlayerNameProps = {
  userId: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ userId }) => {
  const navigation = useAppNavigation();
  const [network, address] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);

  const name = userInfo.metadata?.tokenId || address || "";

  return (
    <FlexRow width="auto" alignItems="center">
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          navigation.navigate("UserPublicProfile", {
            id: userId,
          });
        }}
      >
        <OptimizedImage
          sourceURI={userInfo.metadata?.image}
          fallbackURI={nameServiceDefaultImage(network)}
          width={32}
          height={32}
          style={{
            borderRadius: 999,
            width: 32,
            height: 32,
            aspectRatio: 1,
          }}
        />

        <BrandText
          style={[styles.colData, { marginLeft: layout.spacing_x1 }]}
          numberOfLines={1}
        >
          {name}
        </BrandText>
        <SVG
          width={16}
          height={16}
          color={primaryColor}
          source={badgeSVG}
          style={{ marginLeft: layout.spacing_x1 }}
        />
      </TouchableOpacity>
    </FlexRow>
  );
};

const Rank: React.FC<RankProps> = ({ changes }) => {
  if (changes === 0) {
    return (
      <BrandText style={[styles.colData, { marginLeft: layout.spacing_x3 }]}>
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
          { color: rankColor, marginLeft: layout.spacing_x1 },
        ]}
      >
        {rankSign} {Math.abs(changes)}
      </BrandText>
    </FlexRow>
  );
};

export const RiotGameLeaderboardScreen = () => {
  const isMobile = useIsMobile();
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();
  const selectedNetwork = useSelectedNetworkInfo();

  const fetchLeaderboard = useCallback(async () => {
    const p2eClient = mustGetP2eClient(selectedNetwork?.id);

    const _userScores: UserScore[] = [];

    const currentSeason = await p2eClient.CurrentSeason({});
    setCurrentSeason(currentSeason);

    const streamData = await p2eClient.Leaderboard({
      seasonId: currentSeason.id,
      limit: 500,
      offset: 0,
    });

    await streamData.forEach((item: LeaderboardResponse) => {
      item.userScore && _userScores.push(item.userScore);
    });
    setUserScores(_userScores.filter((val) => val.rank !== 0));
  }, [selectedNetwork?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <GameContentView hideStats contentStyle={styles.contentContainer}>
      <ImageBackground style={styles.jumbotron} source={jumbotronPNG}>
        <SVG style={{ width: 66, height: 72 }} source={logoSVG} />

        <SpacerColumn size={2} />

        <BrandText style={fontSemibold28}>THE R!OT LEADERBOARD</BrandText>

        <SpacerColumn size={2} />

        <BrandText style={fontMedium16}>{currentSeason?.id}</BrandText>
      </ImageBackground>

      <TertiaryBox fullWidth style={{ marginTop: layout.spacing_x2 }}>
        <FlexRow>
          <View style={{ flex: 1 }}>
            <BrandText
              style={[styles.colHeaderTitle, { marginLeft: layout.spacing_x2 }]}
            >
              Rank
            </BrandText>
          </View>
          <View style={{ flex: isMobile ? 1 : 5 }}>
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
          {!isMobile && (
            <View style={{ flex: 1 }}>
              <BrandText style={styles.colHeaderTitle}>
                24 hours Change
              </BrandText>
            </View>
          )}
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
                  style={[styles.colData, { marginLeft: layout.spacing_x3 }]}
                >
                  {userScore.rank}
                </BrandText>
              </View>
              <View style={{ flex: isMobile ? 1 : 5 }}>
                <PlayerName userId={userScore.userId} />
              </View>
              <View
                style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
              >
                <SVG style={{ width: 24, height: 24 }} source={iconXPSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>{xp}</BrandText>
              </View>
              <View
                style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
              >
                <SVG style={{ width: 24, height: 24 }} source={iconFightSVG} />

                <SpacerRow size={1} />

                <BrandText style={styles.colData}>{hours} hours</BrandText>
              </View>
              {!isMobile && (
                <View style={{ flex: 1 }}>
                  <Rank changes={rankChanges} />
                </View>
              )}
            </FlexRow>
          );
        }}
      />
    </GameContentView>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: layout.spacing_x2_5,
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
    marginVertical: layout.spacing_x2,
  },
  colData: {
    marginVertical: layout.spacing_x2_5,
    ...(fontSemibold12 as object),
  },
  rowItem: {
    borderBottomWidth: 1,
    borderBottomColor: neutral33,
  },
});
