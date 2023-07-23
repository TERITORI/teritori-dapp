import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import audio from "../../../../assets/chat/audiocall.svg";
import callend from "../../../../assets/chat/callend.svg";
import audiomute from "../../../../assets/chat/muteaudio.svg";
import videocall from "../../../../assets/chat/videocall.svg";
import videoimage from "../../../../assets/chat/videoimage.svg";
import videosecond from "../../../../assets/chat/videopersonsecond.svg";
import video from "../../../../assets/icons/videocall.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { IconButton } from "../../../components/buttons/IconButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  secondaryColor,
  successColor,
} from "../../../utils/style/colors";
import { fontSemibold11 } from "../../../utils/style/fonts";

interface VideoCallScreenProps {
  setVideoCall: (value: boolean) => void;
  videoCall: boolean;
}
const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ setVideoCall }) => {
  return (
    <View style={styles.container}>
      <View>
        <FlexRow style={styles.iconRow}>
          <View>
            <SVG source={videoimage} />
            <View
              style={{
                position: "absolute",
                left: 5,
                bottom: 26,
                backgroundColor: neutral00,
                padding: 6,
                borderRadius: 6,
              }}
            >
              <BrandText
                style={[
                  fontSemibold11,
                  {
                    color: secondaryColor,
                  },
                ]}
              >
                Me
              </BrandText>
            </View>
          </View>
          <SpacerRow size={2} />

          <View>
            <SVG source={videosecond} />

            <FlexRow
              style={{
                position: "absolute",
                left: 5,
                bottom: 26,
              }}
            >
              <View
                style={{
                  backgroundColor: neutral00,
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <BrandText
                  style={[
                    fontSemibold11,
                    {
                      color: secondaryColor,
                    },
                  ]}
                >
                  Harry
                </BrandText>
              </View>
              <SpacerRow size={1} />
              <IconButton
                iconSVG={audiomute}
                iconSize={25}
                noBrokenCorners
                backgroundColor={neutral00}
                size="M"
                style={{ width: 10 }}
              />
              <SpacerRow size={7} />
              <IconButton
                iconSVG={video}
                iconSize={25}
                noBrokenCorners
                backgroundColor={neutral00}
                size="M"
                style={{ width: 10 }}
              />
            </FlexRow>
          </View>
        </FlexRow>
        <SpacerColumn size={1} />
        <View style={styles.iconRow}>
          <FlexRow>
            <TouchableOpacity>
              <SVG source={videocall} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />

            <TouchableOpacity>
              <SVG source={audio} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity onPress={() => setVideoCall(false)}>
              <SVG source={callend} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </View>
    </View>
  );
};

export default VideoCallScreen;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconRow: {
    alignSelf: "center",
  },
  badge: {
    backgroundColor: successColor,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },
});
