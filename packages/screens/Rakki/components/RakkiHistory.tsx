import moment from "moment";
import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Box } from "@/components/boxes/Box";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { Username } from "@/components/user/Username";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { useRakkiHistory } from "@/hooks/rakki/useRakkiHistory";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { BuyTicketsButton } from "@/screens/Rakki/components/BuyTicketsButton";
import { gameBoxLabelCStyle, sectionLabelCStyle } from "@/screens/Rakki/styles";
import { joinElements } from "@/utils/react";
import { neutral22, neutral33, neutral77 } from "@/utils/style/colors";
import { fontMedium10, fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const RakkiHistory: FC<{
  style?: StyleProp<ViewStyle>;
  networkId: string;
  info: Info;
}> = ({ style, networkId, info }) => {
  const { width } = useMaxResolution();
  const isSmallScreen = width < 400;
  const { rakkiHistory } = useRakkiHistory(networkId);

  if (!rakkiHistory?.length) {
    return null;
  }
  return (
    <View style={style}>
      <BrandText style={sectionLabelCStyle}>RAKKi Finished Rounds</BrandText>
      <Box
        notched
        style={{ backgroundColor: neutral22, marginTop: layout.spacing_x2 }}
      >
        <Box
          notched
          style={{
            backgroundColor: neutral33,
            paddingHorizontal: layout.spacing_x1_5,
            paddingVertical: layout.spacing_x1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={[gameBoxLabelCStyle, { textAlign: "left", marginRight: 10 }]}
          >
            Rounds
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: layout.spacing_x1,
              height: 24,
              minWidth: 24,
              backgroundColor: neutral22,
              borderRadius: 16,
            }}
          >
            <BrandText style={fontSemibold12}>{rakkiHistory.length}</BrandText>
          </View>
        </Box>
        {joinElements(
          rakkiHistory.map((historyItem) => {
            return (
              <View
                key={historyItem.date.toISOString()}
                style={{
                  padding: layout.spacing_x1_5,
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isSmallScreen ? "flex-start" : "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: isSmallScreen ? "100%" : undefined,
                    justifyContent: isSmallScreen ? "space-between" : undefined,
                  }}
                >
                  <UserAvatarWithFrame
                    style={{ marginRight: layout.spacing_x1_5 }}
                    userId={historyItem.winnerUserId}
                    size="XS"
                  />
                  <Username
                    textStyle={gameBoxLabelCStyle}
                    userId={historyItem.winnerUserId}
                  />
                </View>
                <BrandText
                  style={[
                    fontMedium10,
                    {
                      color: neutral77,
                      marginTop: isSmallScreen ? 12 : 0,
                    },
                  ]}
                >
                  Drawn{" "}
                  {moment(historyItem.date.getTime()).format(
                    "MMM D, YYYY, h:mm A",
                  )}
                </BrandText>
              </View>
            );
          }),
          <View style={{ height: 1, backgroundColor: neutral33 }} />,
        )}
        <View style={{ height: 1, backgroundColor: neutral33 }} />
        <View
          style={{
            height: 173,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BuyTicketsButton networkId={networkId} info={info} />
        </View>
      </Box>
    </View>
  );
};
