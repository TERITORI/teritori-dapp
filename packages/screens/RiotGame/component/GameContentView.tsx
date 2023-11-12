import React, { ReactNode } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { FightStatsSection } from "./FightStatsSection";
import { RiotGameHeader } from "./RiotGameHeader";
import { LoaderFullScreen } from "../../../components/loaders/LoaderFullScreen";
import { neutral00 } from "../../../utils/style/colors";

type GameContentViewProps = {
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  bgImage?: ImageSourcePropType;
  hideStats?: boolean;
  loading?: boolean;
  children: ReactNode;
};

export const GameContentView: React.FC<GameContentViewProps> = ({
  containerStyle,
  contentStyle,
  bgImage,
  hideStats = false,
  loading = false,
  ...props
}) => {
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
  );
};
