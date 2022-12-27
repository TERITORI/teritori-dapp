import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { LoaderFullScreen } from "../../../components/loaders/LoaderFullScreen";
import { useGame } from "../../../context/GameProvider";
import { neutral00 } from "../../../utils/style/colors";
import { FightStatsSection } from "./FightStatsSection";
import { ResumeGame } from "./ResumeGame";
import { RiotGameHeader } from "./RiotGameHeader";

type GameContentViewProps = {
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  bgImage?: ImageSourcePropType;
  hideStats?: boolean;
  loading?: boolean;
};

export const GameContentView: React.FC<GameContentViewProps> = ({
  containerStyle,
  contentStyle,
  bgImage,
  hideStats = false,
  loading = false,
  ...props
}) => {
  const { enteredInGame, setEnteredInGame, playGameAudio } = useGame();

  const content = (
    <ScrollView>
      {!hideStats && <FightStatsSection />}

      {contentStyle ? (
        <View style={contentStyle}>{props.children}</View>
      ) : (
        props.children
      )}
    </ScrollView>
  );

  return (
    <>
      {/*Ensure the user interacts with the document by forcing him to click on "Resume game", then we can play game audio*/}
      {!enteredInGame && (
        <ResumeGame
          onPressResume={() => {
            setEnteredInGame(true);
            playGameAudio();
          }}
        />
      )}
      <View style={[{ flex: 1, backgroundColor: neutral00 }, containerStyle]}>
        <RiotGameHeader />
        <LoaderFullScreen visible={loading} />

        {bgImage ? (
          <ImageBackground
            style={{ flex: 1 }}
            source={bgImage}
            resizeMode="cover"
          >
            {content}
          </ImageBackground>
        ) : (
          content
        )}
      </View>
    </>
  );
};
